import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { ordersService } from '../services/orders';
import { productsService } from '../services/products';
import { useWebSocket } from '../hooks/useWebSocket';
import { 
  Package, 
  Plus, 
  ShoppingCart,
  Clock,
  CheckCircle,
  TrendingUp,
  Loader2
} from 'lucide-react';

const OutletManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('place-order');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { lastMessage } = useWebSocket();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (lastMessage?.type === 'order_status_update') {
      loadOrders();
      toast({
        title: 'Order Status Updated',
        description: `Order #${lastMessage.data.order_id} is now ${lastMessage.data.status}`,
      });
    }
  }, [lastMessage]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        productsService.getAll({ is_active: true }),
        ordersService.getByBranch(user.branch || '1')
      ]);
      
      setProducts(productsRes.data.items || []);
      setOrders(ordersRes.data.items || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await ordersService.getByBranch(user.branch || '1');
      setOrders(response.data.items || []);
    } catch (error) {
      console.error('Failed to reload orders:', error);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product_id: product.id, quantity: 1, name: product.name, price: product.price }]);
    }
    toast({
      title: 'Added to Cart',
      description: `${product.name} added to cart`,
    });
  };

  const updateQuantity = (productId, delta) => {
    setCart(cart.map(item =>
      item.product_id === productId
        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Please add items to cart before placing order',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await ordersService.create({
        user_id: user.id,
        items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity }))
      });

      toast({
        title: 'Order Placed',
        description: 'Your order has been placed successfully',
      });

      setCart([]);
      loadOrders();
      setActiveTab('orders');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Outlet Manager Dashboard</h1>
          <p className="text-muted-foreground">Branch: {user.branch}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-accent">
                    {orders.filter(o => o.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-primary">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cart Items</p>
                  <p className="text-2xl font-bold">{cart.length}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'place-order' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('place-order')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Place Order
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('orders')}
          >
            <Package className="h-4 w-4 mr-2" />
            My Orders
          </Button>
        </div>

        {/* Place Order Tab */}
        {activeTab === 'place-order' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Products</CardTitle>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {categories.map(cat => (
                      <Button
                        key={cat}
                        size="sm"
                        variant={selectedCategory === cat ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProducts.map(product => (
                      <div key={product.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <p className="text-lg font-bold mt-2">₹{product.price}</p>
                        <Button
                          onClick={() => addToCart(product)}
                          className="w-full mt-3"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Cart ({cart.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-4 mb-4">
                        {cart.map(item => (
                          <div key={item.product_id} className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">₹{item.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.product_id, -1)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.product_id, 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-lg mb-4">
                          <span>Total:</span>
                          <span>₹{totalAmount}</span>
                        </div>
                        <Button
                          onClick={placeOrder}
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Placing Order...
                            </>
                          ) : (
                            'Place Order'
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card>
            <CardHeader>
              <CardTitle>My Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'packed' ? 'secondary' : 'outline'
                        }
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          {item.product_name} x {item.quantity} = ₹{item.price * item.quantity}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t font-bold">
                      Total: ₹{order.total_amount}
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No orders yet</p>
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
