import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { fakeProducts } from '../data/products';
import { fakeOrders } from '../data/orders';
import { getCurrentUser } from '../utils/auth';
import { 
  Package, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Printer,
  TrendingUp,
  Users,
  Factory,
  Bell
} from 'lucide-react';

const FactoryManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState(fakeOrders);
  const [products, setProducts] = useState(fakeProducts);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { toast } = useToast();
  
  const user = getCurrentUser();
  
  // Filter orders for current factory
  const factoryOrders = orders.filter(order => 
    order.items.some(item => item.factoryId === user?.factoryId)
  );
  
  // Get products for this factory
  const factoryProducts = products.filter(product => 
    product.factoryOptions.some(factory => factory.factoryId === user?.factoryId)
  );

  // Stats
  const pendingOrders = factoryOrders.filter(order => order.status === 'pending').length;
  const confirmedOrders = factoryOrders.filter(order => order.status === 'confirmed').length;
  const packedOrders = factoryOrders.filter(order => order.status === 'packed').length;
  const totalRevenue = factoryOrders
    .filter(order => ['packed', 'shipped', 'delivered'].includes(order.status))
    .reduce((sum, order) => {
      const factoryItems = order.items.filter(item => item.factoryId === user?.factoryId);
      return sum + factoryItems.reduce((itemSum, item) => itemSum + (item.price * item.quantity), 0);
    }, 0);

  // Get unique branches that have ordered from this factory
  const branches = [...new Set(factoryOrders.map(order => order.branchLocation))];

  // Simulate new order notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new orders (simulate)
      if (Math.random() < 0.05) { // 5% chance every 10 seconds
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
        
        toast({
          title: "New Order Received!",
          description: "A new order has been assigned to your factory.",
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [toast]);

  const confirmOrder = (orderId) => {
    setOrders(prevOrders => 
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: 'confirmed', confirmedAt: new Date().toISOString() }
          : order
      )
    );
    
    toast({
      title: "Order Confirmed",
      description: "Order has been confirmed and moved to production.",
    });
  };

  const markAsPacked = (orderId) => {
    setOrders(prevOrders => 
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: 'packed', packedAt: new Date().toISOString() }
          : order
      )
    );
    
    toast({
      title: "Order Packed",
      description: "Order has been packed and is ready for pickup.",
    });
  };

  const updateProductStock = (productId, newStock) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, stock: parseInt(newStock) || 0 }
          : product
      )
    );
    
    toast({
      title: "Stock Updated",
      description: "Product stock has been updated successfully.",
    });
  };

  const printOrderSlip = (order) => {
    // Filter items for this factory only
    const factoryItems = order.items.filter(item => item.factoryId === user?.factoryId);
    
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center;">Karachi Bakery - Production Slip</h2>
        <h3 style="text-align: center;">${user?.factoryName}</h3>
        <hr/>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Branch:</strong> ${order.branchLocation}</p>
        <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
        <p><strong>Status:</strong> ${order.status.toUpperCase()}</p>
        <hr/>
        <h4>Items to Produce:</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="border-bottom: 1px solid #ccc;">
              <th style="text-align: left; padding: 8px;">Product</th>
              <th style="text-align: center; padding: 8px;">Quantity</th>
              <th style="text-align: right; padding: 8px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${factoryItems.map((item: any) => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px;">${item.productName}</td>
                <td style="text-align: center; padding: 8px;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px;">₹${item.price}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <hr/>
        <p style="text-align: center; margin-top: 20px;">Generated on ${new Date().toLocaleString()}</p>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
    
    toast({
      title: "Printing...",
      description: "Order slip has been sent to printer.",
    });
  };

  // Filter orders based on selections
  let filteredOrders = factoryOrders;
  
  if (selectedBranch !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.branchLocation === selectedBranch);
  }
  
  if (selectedStatus !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.status === selectedStatus);
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'confirmed': return 'secondary';
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
          <h1 className="text-3xl font-bold text-foreground">Factory Manager Dashboard</h1>
          <p className="text-muted-foreground">{user?.factoryName} - {user?.name}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold text-destructive">{pendingOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Production</p>
                  <p className="text-2xl font-bold text-accent">{confirmedOrders}</p>
                </div>
                <Factory className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ready Orders</p>
                  <p className="text-2xl font-bold text-primary">{packedOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert for pending orders */}
        {pendingOrders > 0 && (
          <Card className="border-destructive shadow-warm mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-destructive animate-pulse" />
                <span className="font-medium text-destructive">
                  You have {pendingOrders} pending order{pendingOrders > 1 ? 's' : ''} requiring confirmation
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton id="orders" label="Orders" icon={Package} />
          <TabButton id="inventory" label="Inventory" icon={Factory} />
          <TabButton id="analytics" label="Analytics" icon={TrendingUp} />
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Factory Orders</span>
                <div className="flex gap-4">
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch: string) => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="packed">Packed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No orders found</p>
                ) : (
                  filteredOrders.map(order => {
                    const factoryItems = order.items.filter(item => item.factoryId === user?.factoryId);
                    const factoryTotal = factoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    
                    return (
                      <Card key={order.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{order.orderId}</h3>
                              <p className="text-sm text-muted-foreground">{order.branchLocation}</p>
                              <p className="text-xs text-muted-foreground">
                                Ordered: {new Date(order.orderDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant={getStatusColor(order.status)} className="mb-2">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                              <p className="font-semibold">₹{factoryTotal.toLocaleString()}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <h4 className="font-medium">Items for Production:</h4>
                            {factoryItems.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-sm bg-secondary/20 p-2 rounded">
                                <span className="font-medium">{item.productName}</span>
                                <span>Qty: {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex gap-2 flex-wrap">
                            {order.status === 'pending' && (
                              <Button
                                onClick={() => confirmOrder(order.id)}
                                className="bg-gradient-pink"
                                size="sm"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Confirm Order
                              </Button>
                            )}
                            
                            {order.status === 'confirmed' && (
                              <Button
                                onClick={() => markAsPacked(order.id)}
                                className="bg-gradient-pink"
                                size="sm"
                              >
                                <Package className="h-4 w-4 mr-2" />
                                Mark as Packed
                              </Button>
                            )}
                            
                            <Button
                              onClick={() => printOrderSlip(order)}
                              variant="outline"
                              size="sm"
                            >
                              <Printer className="h-4 w-4 mr-2" />
                              Print Slip
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'inventory' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {factoryProducts.map(product => (
                  <Card key={product.id} className="border">
                    <CardContent className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-primary">₹{product.price}</span>
                        <Badge variant={product.stock > 10 ? "default" : "destructive"}>
                          {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm">Update Stock:</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="0"
                            defaultValue={product.stock}
                            onChange={(e) => updateProductStock(product.id, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={() => updateProductStock(product.id, product.stock)}
                            size="sm"
                            className="bg-gradient-pink"
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Factory Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{factoryOrders.length}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {Math.round((factoryOrders.filter(o => o.status !== 'pending').length / factoryOrders.length) * 100) || 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Processing Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {branches.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Active Branches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {factoryOrders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.orderId}</p>
                        <p className="text-sm text-muted-foreground">{order.branchLocation}</p>
                      </div>
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactoryManagerDashboard;