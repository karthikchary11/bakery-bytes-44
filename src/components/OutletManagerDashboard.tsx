import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import { fakeProducts, productCategories } from '../data/products';
import { fakeOrders } from '../data/orders';
import { getCurrentUser } from '../utils/auth';
import { 
  ShoppingCart, 
  Package, 
  Clock, 
  CheckCircle,
  Plus,
  Minus,
  History,
  AlertCircle,
  Store
} from 'lucide-react';

const OutletManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('place-order');
  const [products] = useState(fakeProducts);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(fakeOrders);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFactories, setSelectedFactories] = useState({});
  const { toast } = useToast();
  
  const user = getCurrentUser();
  
  // Filter orders for current outlet
  const outletOrders = orders.filter(order => order.outletId === user?.id);
  
  // Stats
  const pendingOrders = outletOrders.filter(order => order.status === 'pending').length;
  const packedOrders = outletOrders.filter(order => order.status === 'packed').length;
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Simulate real-time order status updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update order status (simulate factory updates)
      setOrders(prevOrders => {
        return prevOrders.map(order => {
          if (order.outletId === user?.id && order.status === 'confirmed' && Math.random() < 0.1) {
            const updatedOrder = { ...order, status: 'packed', packedAt: new Date().toISOString() };
            
            // Show notification
            toast({
              title: "Order Update",
              description: `Order ${order.orderId} has been packed and ready for pickup!`,
            });
            
            // Play notification sound
            const audio = new Audio('/notification.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));
            
            return updatedOrder;
          }
          return order;
        });
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [user?.id, toast]);

  const addToCart = (product) => {
    const factoryId = selectedFactories[product.id];
    
    if (product.category === 'biscuits' && !factoryId) {
      toast({
        title: "Factory Selection Required",
        description: "Please select a factory for biscuit products.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedFactory = factoryId ? 
      product.factoryOptions.find(f => f.factoryId === factoryId) : 
      product.factoryOptions[0];
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.id === product.id && item.factoryId === selectedFactory.factoryId
      );
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.factoryId === selectedFactory.factoryId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevCart, {
        ...product,
        quantity: 1,
        factoryId: selectedFactory.factoryId,
        factoryName: selectedFactory.factoryName
      }];
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} added to cart`,
    });
  };

  const updateCartQuantity = (productId, factoryId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => !(item.id === productId && item.factoryId === factoryId)));
    } else {
      setCart(cart.map(item =>
        item.id === productId && item.factoryId === factoryId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before placing order.",
        variant: "destructive",
      });
      return;
    }
    
    const newOrder = {
      id: Date.now(),
      orderId: `ORD${String(Math.floor(Math.random() * 9000) + 1000)}`,
      outletId: user.id,
      outletName: user.name,
      branchLocation: user.branchLocation,
      branchId: user.branchId,
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
        factoryId: item.factoryId,
        factoryName: item.factoryName
      })),
      totalAmount: cartTotal,
      status: 'pending',
      orderDate: new Date().toISOString(),
      confirmedAt: null,
      packedAt: null,
      shippedAt: null,
      deliveredAt: null,
      notes: null
    };
    
    setOrders([...orders, newOrder]);
    setCart([]);
    
    toast({
      title: "Order Placed Successfully",
      description: `Order ${newOrder.orderId} has been submitted to factories.`,
    });
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'confirmed': return 'default';
      case 'packed': return 'default';
      case 'shipped': return 'default';
      case 'delivered': return 'default';
      default: return 'secondary';
    }
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <Button
      variant={activeTab === id ? "default" : "ghost"}
      onClick={() => setActiveTab(id)}
      className="flex items-center gap-2"
    >
      <Icon size={18} />
      {label}
    </Button>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Outlet Manager Dashboard</h1>
          <p className="text-muted-foreground">{user?.branchLocation} - {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cart Items</p>
                  <p className="text-2xl font-bold text-primary">{cart.length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cart Total</p>
                  <p className="text-2xl font-bold text-primary">₹{cartTotal.toLocaleString()}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold text-accent">{pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready Orders</p>
                  <p className="text-2xl font-bold text-accent">{packedOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton id="place-order" label="Place Order" icon={ShoppingCart} />
          <TabButton id="order-history" label="Order History" icon={History} />
        </div>

        {/* Tab Content */}
        {activeTab === 'place-order' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Products Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Select Products</CardTitle>
                  <div className="flex gap-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {productCategories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map(product => (
                      <Card key={product.id} className="border">
                        <CardContent className="p-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded-lg mb-3"
                          />
                          <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{product.description}</p>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-lg font-bold text-primary">₹{product.price}</span>
                            <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                              {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                            </Badge>
                          </div>
                          
                          {/* Factory Selection for Biscuits */}
                          {product.category === 'biscuits' && (
                            <div className="mb-3">
                              <Label className="text-xs mb-1 block">Select Factory:</Label>
                              <Select 
                                value={selectedFactories[product.id] || ''} 
                                onValueChange={(value) => setSelectedFactories({
                                  ...selectedFactories,
                                  [product.id]: value
                                })}
                              >
                                <SelectTrigger className="w-full h-8">
                                  <SelectValue placeholder="Choose factory" />
                                </SelectTrigger>
                                <SelectContent>
                                  {product.factoryOptions.map(factory => (
                                    <SelectItem key={factory.factoryId} value={factory.factoryId}>
                                      {factory.factoryName}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          <Button
                            onClick={() => addToCart(product)}
                            disabled={product.stock === 0}
                            className="w-full bg-gradient-pink text-xs h-8"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cart Section */}
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <CardTitle>Shopping Cart ({cart.length} items)</CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={`${item.id}-${item.factoryId}`} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-muted-foreground">{item.factoryName}</p>
                            <p className="text-sm font-semibold text-primary">₹{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(item.id, item.factoryId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(item.id, item.factoryId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold">Total:</span>
                          <span className="text-xl font-bold text-primary">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <Button onClick={placeOrder} className="w-full bg-gradient-pink">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Place Order
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'order-history' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Order History - {user?.branchLocation}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {outletOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No orders found</p>
                ) : (
                  outletOrders.map(order => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{order.orderId}</h3>
                          <p className="text-sm text-muted-foreground">
                            Placed on {new Date(order.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(order.status)} className="mb-2">
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <p className="font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span>{item.productName} (x{item.quantity})</span>
                            <span className="text-muted-foreground">{item.factoryName}</span>
                          </div>
                        ))}
                      </div>
                      
                      {order.status === 'packed' && (
                        <div className="mt-3 p-2 bg-accent/10 rounded border-l-4 border-accent">
                          <div className="flex items-center gap-2 text-accent">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Ready for pickup!</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OutletManagerDashboard;