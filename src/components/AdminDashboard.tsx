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
  const [products, setProducts] = useState(fakeProducts);
  const [users, setUsers] = useState(fakeUsers);
  const [orders] = useState(fakeOrders);
  const [factoryOrders] = useState(fakeFactoryOrders);
  const { toast } = useToast();

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

  const totalRevenue = factoryOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingUsers = users.filter(user => !user.approved && user.role === 'user').length;
  const outOfStockProducts = products.filter(product => product.stock === 0).length;
  const totalFactoryOrders = factoryOrders.length;
  const pendingFactoryOrders = factoryOrders.filter(order => order.status === 'pending').length;

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: LucideIcon }) => (
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
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your Karachi Bakery franchise network</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                  <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold text-primary">{products.length}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Factory Orders</p>
                  <p className="text-2xl font-bold text-primary">{totalFactoryOrders}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Factory Orders</p>
                  <p className="text-2xl font-bold text-accent">{pendingFactoryOrders}</p>
                </div>
                <Clock className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <TabButton id="overview" label="Overview" icon={TrendingUp} />
          <TabButton id="orders" label="All Orders" icon={Package} />
          <TabButton id="products" label="Products" icon={Package} />
          <TabButton id="users" label="User Management" icon={Users} />
          <TabButton id="register" label="Add Franchise" icon={Plus} />
          <TabButton id="analytics" label="Analytics" icon={TrendingUp} />
        </div>

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
                  {factoryOrders.slice(0, 5).map((order) => (
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
                {factoryOrders.map((order) => (
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

        {activeTab === 'analytics' && <AnalyticsDashboard />}

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