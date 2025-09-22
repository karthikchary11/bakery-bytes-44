import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { fakeProducts } from '../data/products';
import { fakeUsers } from '../data/users';
import { fakeOrders } from '../data/orders';
import { fakeFactoryOrders } from '../data/factoryOrders';
import { 
  Package, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Clock,
  LucideIcon
} from 'lucide-react';
import AnalyticsDashboard from './AnalyticsDashboard';
import ProductManagement from './ProductManagement';
import { sendApprovalNotification } from '../utils/emailService';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('month');

  // Update time period when switching to analytics tab
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'analytics' && selectedTimePeriod !== 'all') {
      setSelectedTimePeriod('all');
    } else if (tabId !== 'analytics' && selectedTimePeriod === 'all') {
      setSelectedTimePeriod('month');
    }
  };
  const [products, setProducts] = useState(fakeProducts);
  const [users, setUsers] = useState(fakeUsers);
  const [orders] = useState(fakeOrders);
  const [factoryOrders] = useState(fakeFactoryOrders);
  const { toast } = useToast();

  // Time period filtering function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getTimeFilteredData = (data: any[]): any[] => {
    const now = new Date();
    
    switch (selectedTimePeriod) {
      case 'all':
        return data; // Return all data without filtering
        
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return data.filter(item => new Date(item.date || item.orderDate) >= weekAgo);
      }
        
      case 'month':
        return data.filter(item => {
          const itemDate = new Date(item.date || item.orderDate);
          return itemDate.getMonth() === now.getMonth() && 
                 itemDate.getFullYear() === now.getFullYear();
        });
        
      case 'quarter': {
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        return data.filter(item => new Date(item.date || item.orderDate) >= quarterStart);
      }
        
      case 'year':
        return data.filter(item => {
          const itemDate = new Date(item.date || item.orderDate);
          return itemDate.getFullYear() === now.getFullYear();
        });
        
      default:
        return data;
    }
  };

  const approveUser = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setUsers(users.map(u => 
      u.id === userId ? { ...u, approved: true } : u
    ));
    
    toast({
      title: "User Approved",
      description: "Franchise owner approved successfully.",
    });

    // Send approval email
    try {
      await sendApprovalNotification(user, true);
      toast({
        title: "Email Sent",
        description: "Approval notification sent to user.",
      });
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      toast({
        title: "Email Warning",
        description: "User approved but email notification failed.",
        variant: "destructive",
      });
    }
  };

  const rejectUser = async (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    setUsers(users.map(u => 
      u.id === userId ? { ...u, approved: false } : u
    ));
    
    toast({
      title: "User Rejected", 
      description: "Franchise owner rejected.",
      variant: "destructive",
    });

    // Send rejection email
    try {
      await sendApprovalNotification(user, false);
      toast({
        title: "Email Sent",
        description: "Rejection notification sent to user.",
      });
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      toast({
        title: "Email Warning",
        description: "User rejected but email notification failed.",
        variant: "destructive",
      });
    }
  };

  const totalRevenue = getTimeFilteredData(factoryOrders).reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingUsers = users.filter(user => !user.approved && user.role === 'user').length;
  const outOfStockProducts = products.filter(product => product.stock === 0).length;
  const totalFactoryOrders = getTimeFilteredData(factoryOrders).length;
  const pendingFactoryOrders = getTimeFilteredData(factoryOrders).filter(order => order.status === 'pending').length;

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: LucideIcon }) => (
    <Button
      variant={activeTab === id ? "default" : "ghost"}
      onClick={() => handleTabChange(id)}
      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2"
    >
      <Icon size={16} className="sm:w-4 sm:h-4" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.split(' ')[0]}</span>
    </Button>
  );

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage your Karachi Bakery franchise network</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{products.length}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Factory Orders</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{totalFactoryOrders}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending Factory Orders</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent">{pendingFactoryOrders}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8">
          <TabButton id="overview" label="Overview" icon={TrendingUp} />
          <TabButton id="orders" label="All Orders" icon={Package} />
          <TabButton id="products" label="Products" icon={Package} />
          <TabButton id="users" label="Users" icon={Users} />
          <TabButton id="register" label="Add Franchise" icon={Plus} />
          <TabButton id="analytics" label="Analytics" icon={TrendingUp} />
        </div>

        {/* Time Period Filter */}
        {(activeTab === 'analytics' || activeTab === 'orders' || activeTab === 'overview') && (
          <Card className="shadow-soft mb-4 sm:mb-6">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <h3 className="text-sm sm:text-lg font-semibold">
                    {activeTab === 'analytics' ? 'All Time Analytics Filter:' : 'Time Period Filter:'}
                  </h3>
                </div>
                <select
                  value={selectedTimePeriod}
                  onChange={(e) => setSelectedTimePeriod(e.target.value)}
                  className="p-2 border rounded-md bg-background text-sm"
                >
                  {activeTab === 'analytics' ? (
                    <>
                      <option value="all">All Time</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                    </>
                  ) : (
                    <>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="quarter">This Quarter</option>
                      <option value="year">This Year</option>
                    </>
                  )}
                </select>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {activeTab === 'analytics' ? (
                    `Showing analytics for: ${selectedTimePeriod === 'all' ? 'All Time' :
                     selectedTimePeriod === 'week' ? 'This Week' :
                     selectedTimePeriod === 'month' ? 'This Month' :
                     selectedTimePeriod === 'quarter' ? 'This Quarter' : 'This Year'}`
                  ) : (
                    `Showing data for: ${selectedTimePeriod === 'week' ? 'This Week' :
                     selectedTimePeriod === 'month' ? 'This Month' :
                     selectedTimePeriod === 'quarter' ? 'This Quarter' : 'This Year'}`
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {outOfStockProducts > 0 && (
              <Card className="border-destructive shadow-warm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <span className="font-medium text-destructive">
                      {outOfStockProducts} products are out of stock
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Recent Factory Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTimeFilteredData(factoryOrders).slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{order.factoryName}</p>
                        <p className="text-sm text-muted-foreground">{order.branchName} - {order.franchiseName}</p>
                        <p className="text-sm text-muted-foreground">{order.products.map(p => p.name).join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{order.totalAmount}</p>
                        <Badge variant={
                          order.status === 'packed' ? 'default' :
                          order.status === 'pending' ? 'secondary' : 'outline'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'orders' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>All Factory Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getTimeFilteredData(factoryOrders).map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          Factory: {order.factoryName} | Branch: {order.branchName} ({order.branchCode})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Franchise: {order.franchiseName} - {order.franchiseLocation}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Date: {order.orderDate} | Total: ₹{order.totalAmount}
                        </p>
                      </div>
                      <Badge variant={
                        order.status === 'packed' ? 'default' :
                        order.status === 'pending' ? 'secondary' : 'outline'
                      }>
                        {order.status}
                      </Badge>
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
                {getTimeFilteredData(factoryOrders).length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders found for this time period.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'products' && (
          <ProductManagement products={products} setProducts={setProducts} />
        )}

        {activeTab === 'users' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.filter(user => user.role === 'user').map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.approved ? 'default' : 'secondary'}>
                        {user.approved ? 'Approved' : 'Pending'}
                      </Badge>
                      {!user.approved && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveUser(user.id)}
                            className="bg-gradient-pink"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => rejectUser(user.id)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard selectedTimePeriod={selectedTimePeriod} />}

        {activeTab === 'register' && (
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Add New Franchise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-2xl">
                <p className="text-muted-foreground mb-4">
                  Share this registration link with franchise owners to allow them to register:
                </p>
                <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                  <Input 
                    value={`${window.location.origin}/register`}
                    readOnly
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/register`);
                      toast({
                        title: "Link Copied",
                        description: "Registration link copied to clipboard.",
                      });
                    }}
                    className="bg-gradient-pink"
                  >
                    Copy Link
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  <strong>Note:</strong> New registrations will appear in the User Management tab for approval.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;