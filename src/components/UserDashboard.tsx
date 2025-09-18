import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { getCurrentUser } from '../utils/auth';
import { fakeProducts } from '../data/products';
import { fakeOrders, generateOrderId } from '../data/orders';
import { sendOrderNotification } from '../utils/emailService';
import { 
  ShoppingCart, 
  Package, 
  Minus, 
  Plus, 
  Trash2,
  Send,
  History,
  User
} from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products] = useState(fakeProducts.filter(p => p.stock > 0));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders] = useState(fakeOrders.filter(order => order.userId === getCurrentUser()?.id));
  const { toast } = useToast();
  const user = getCurrentUser();

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      });
      return;
    }

    const orderId = generateOrderId();
    
    // Create order data for email
    const orderData = {
      productName: cart.map(item => `${item.name} (x${item.quantity})`).join(', '),
      quantity: cart.reduce((total, item) => total + item.quantity, 0),
      total: getTotalAmount(),
      franchiseLocation: user?.location || 'Unknown Location',
      customerName: user?.name || 'Unknown Customer'
    };

    try {
      // Send order notification email to admin
      await sendOrderNotification(orderData);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Order #${orderId} for ₹${getTotalAmount()} has been placed. Admin has been notified via email.`,
      });
    } catch (emailError) {
      console.error('Failed to send order notification:', emailError);
      
      toast({
        title: "Order Placed",
        description: `Order #${orderId} for ₹${getTotalAmount()} has been placed, but email notification failed.`,
      });
    }

    // Clear cart after placing order
    setCart([]);
  };

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
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
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {user?.name}
          </h1>
          <p className="text-muted-foreground">{user?.location} - Franchise Dashboard</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  <p className="text-2xl font-bold text-primary">₹{getTotalAmount()}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Past Orders</p>
                  <p className="text-2xl font-bold text-primary">{orders.length}</p>
                </div>
                <History className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton id="products" label="Products" icon={Package} />
          <TabButton id="cart" label={`Cart (${cart.length})`} icon={ShoppingCart} />
          <TabButton id="orders" label="Order History" icon={History} />
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Available Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="shadow-soft hover:shadow-warm transition-shadow">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-secondary rounded-lg mb-4 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-primary">₹{product.price}</span>
                        <Badge variant="default">
                          {product.stock} available
                        </Badge>
                      </div>
                      <Button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-gradient-pink"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'cart' && (
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Shopping Cart</CardTitle>
              {cart.length > 0 && (
                <Button 
                  onClick={placeOrder}
                  className="bg-gradient-pink"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Place Order
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Button 
                    onClick={() => setActiveTab('products')}
                    className="mt-4"
                  >
                    Browse Products
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right min-w-[4rem]">
                          <p className="font-bold">₹{item.price * item.quantity}</p>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount:</span>
                      <span className="text-primary">₹{getTotalAmount()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'orders' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">{order.productName}</p>
                        <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{order.total}</p>
                        <Badge variant={
                          order.status === 'completed' ? 'default' : 
                          order.status === 'shipped' ? 'secondary' : 'outline'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;