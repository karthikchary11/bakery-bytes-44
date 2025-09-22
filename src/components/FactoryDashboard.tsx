import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { getCurrentUser } from '../utils/auth';
import { fakeProducts } from '../data/products';
import { 
  getFactoryOrdersByFactory, 
  getFactoryOrdersByBranch, 
  getFactoryOrdersByStatus,
  updateFactoryOrderStatus 
} from '../data/factoryOrders';
import { 
  Package, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Printer,
  Eye,
  Filter,
  Search,
  Factory,
  MapPin
} from 'lucide-react';
import FactoryAnalytics from './FactoryAnalytics';

const FactoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const user = getCurrentUser();

  // Get factory-specific data
  const factoryOrders = getFactoryOrdersByFactory(user?.factoryId || 1);
  const factoryProducts = fakeProducts.filter(p => 
    user?.categories?.includes(p.category)
  );

  // Filter orders based on selected criteria
  const filteredOrders = factoryOrders.filter(order => {
    const branchMatch = selectedBranch === 'all' || order.branchId.toString() === selectedBranch;
    const statusMatch = selectedStatus === 'all' || order.status === selectedStatus;
    const searchMatch = searchTerm === '' || 
      order.franchiseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return branchMatch && statusMatch && searchMatch;
  });

  const pendingOrders = getFactoryOrdersByStatus(user?.factoryId || 1, 'pending');
  const packedOrders = getFactoryOrdersByStatus(user?.factoryId || 1, 'packed');
  const totalRevenue = factoryOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  const markAsPacked = (orderId) => {
    const updatedOrder = updateFactoryOrderStatus(orderId, 'packed', user?.name || 'Factory Worker');
    if (updatedOrder) {
      toast({
        title: "Order Marked as Packed",
        description: `Order ${orderId} has been marked as packed successfully.`,
      });
    }
  };

  const printOrder = (order) => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="text-align: center; color: #333;">Karachi Bakery - Factory Order</h2>
        <hr style="margin: 20px 0;">
        
        <div style="margin-bottom: 20px;">
          <h3>Order Details</h3>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Factory:</strong> ${order.factoryName}</p>
          <p><strong>Branch:</strong> ${order.branchName} (${order.branchCode})</p>
          <p><strong>Franchise:</strong> ${order.franchiseName} - ${order.franchiseLocation}</p>
          <p><strong>Order Date:</strong> ${order.orderDate}</p>
          <p><strong>Status:</strong> ${order.status}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3>Products</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.products.map(product => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${product.name}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${product.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">₹${product.price}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">₹${product.price * product.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-bottom: 20px;">
          <h3>Order Summary</h3>
          <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
          ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Karachi Bakery - ${order.factoryName}</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
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
            {user?.name} Dashboard
          </h1>
          <p className="text-muted-foreground">
            <Factory className="inline h-4 w-4 mr-1" />
            {user?.factoryType?.toUpperCase()} Factory - {user?.location}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold text-accent">{pendingOrders.length}</p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Packed Orders</p>
                  <p className="text-2xl font-bold text-primary">{packedOrders.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold text-primary">{factoryOrders.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton id="orders" label="Orders" icon={Package} />
          <TabButton id="products" label="Products" icon={Package} />
          <TabButton id="analytics" label="Analytics" icon={TrendingUp} />
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filters */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Order Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Branch</label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Branches</option>
                      {user?.branches?.map(branch => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} ({branch.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <Button 
                      onClick={() => {
                        setSelectedBranch('all');
                        setSelectedStatus('all');
                        setSearchTerm('');
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Factory Orders ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            {order.branchName} ({order.branchCode}) - {order.franchiseName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {order.orderDate} | Total: ₹{order.totalAmount}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            order.status === 'pending' ? 'secondary' :
                            order.status === 'packed' ? 'default' :
                            order.status === 'shipped' ? 'outline' : 'secondary'
                          }>
                            {order.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => printOrder(order)}
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </Button>
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => markAsPacked(order.id)}
                              className="bg-gradient-pink"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Packed
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Products:</h4>
                        {order.products.map((product, index) => (
                          <div key={index} className="flex justify-between items-center bg-secondary p-2 rounded">
                            <span className="text-sm">{product.name}</span>
                            <span className="text-sm font-medium">
                              Qty: {product.quantity} × ₹{product.price} = ₹{product.price * product.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      {order.notes && (
                        <div className="mt-3 p-2 bg-accent/10 rounded">
                          <p className="text-sm"><strong>Notes:</strong> {order.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {filteredOrders.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders found matching your criteria</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'products' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Factory Products - {user?.categories?.join(', ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {factoryProducts.map((product) => (
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
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Sold: {product.sold} units
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <FactoryAnalytics factoryId={user?.factoryId} factoryType={user?.factoryType} />
        )}
      </div>
    </div>
  );
};

export default FactoryDashboard;
