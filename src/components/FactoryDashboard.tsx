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
  MapPin,
  Calendar,
  CalendarDays,
  XCircle,
  Edit
} from 'lucide-react';
import FactoryAnalytics from './FactoryAnalytics';

const FactoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState(fakeProducts);
  const { toast } = useToast();
  const user = getCurrentUser();

  // Get factory-specific data
  const factoryOrders = getFactoryOrdersByFactory(user?.factoryId || 1);
  const factoryProducts = products.filter(p => 
    user?.categories?.includes(p.category)
  );

  // Date filtering helper function
  const getDateFilteredOrders = (orders: any[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    switch (selectedDateFilter) {
      case 'today':
        return orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.toDateString() === today.toDateString();
        });
      case 'yesterday':
        return orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.toDateString() === yesterday.toDateString();
        });
      case 'thisWeek':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= weekStart;
        });
      case 'thisMonth':
        return orders.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate.getMonth() === today.getMonth() && 
                 orderDate.getFullYear() === today.getFullYear();
        });
      default:
        return orders;
    }
  };

  // Filter orders based on selected criteria
  const filteredOrders = getDateFilteredOrders(factoryOrders).filter(order => {
    const branchMatch = selectedBranch === 'all' || order.branchId.toString() === selectedBranch;
    const statusMatch = selectedStatus === 'all' || order.status === selectedStatus;
    const searchMatch = searchTerm === '' || 
      order.franchiseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return branchMatch && statusMatch && searchMatch;
  });

  // Separate pending and packed orders
  const pendingOrders = filteredOrders.filter(order => order.status === 'pending');
  const packedOrders = filteredOrders.filter(order => order.status === 'packed');
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  const markAsPacked = (orderId) => {
    const updatedOrder = updateFactoryOrderStatus(orderId, 'packed', user?.name || 'Factory Worker');
    if (updatedOrder) {
      toast({
        title: "Order Packed!",
        description: `Order #${orderId} has been marked as packed and moved to Packed Orders.`,
      });
      // Automatically switch to packed orders tab
      setActiveTab('packed');
    }
  };

  const updateProductStock = (productId: number, newStock: number) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock }
          : product
      )
    );
    
    const product = products.find(p => p.id === productId);
    toast({
      title: "Stock Updated!",
      description: `${product?.name} stock has been updated to ${newStock} units.`,
    });
  };

  const markOutOfStock = (productId: number) => {
    updateProductStock(productId, 0);
  };

  const restockProduct = (productId: number) => {
    updateProductStock(productId, 50); // Default restock to 50 units
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {user?.name} Dashboard
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            <Factory className="inline h-4 w-4 mr-1" />
            {user?.factoryType?.toUpperCase()} Factory - {user?.location}
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="shadow-soft">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pending Orders</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent">{pendingOrders.length}</p>
                </div>
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
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
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Filtered Revenue</p>
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
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Filtered Orders</p>
                  <p className="text-xl sm:text-2xl font-bold text-primary">{filteredOrders.length}</p>
                </div>
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-6 sm:mb-8">
          <TabButton id="orders" label="Orders" icon={Package} />
          <TabButton id="packed" label="Packed" icon={CheckCircle} />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
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
                    <label className="block text-sm font-medium mb-2">Date Filter</label>
                    <select
                      value={selectedDateFilter}
                      onChange={(e) => setSelectedDateFilter(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="yesterday">Yesterday</option>
                      <option value="thisWeek">This Week</option>
                      <option value="thisMonth">This Month</option>
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
                        setSelectedDateFilter('all');
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
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Pending Orders ({pendingOrders.length})
                  {selectedDateFilter !== 'all' && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedDateFilter === 'today' ? 'Today' :
                       selectedDateFilter === 'yesterday' ? 'Yesterday' :
                       selectedDateFilter === 'thisWeek' ? 'This Week' :
                       selectedDateFilter === 'thisMonth' ? 'This Month' : selectedDateFilter}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm sm:text-base">Order #{order.id}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            <MapPin className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="font-semibold text-primary bg-primary/10 px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm">
                              {order.branchName} ({order.branchCode})
                            </span>
                            <span className="ml-1 sm:ml-2 block sm:inline mt-1 sm:mt-0">- {order.franchiseName}</span>
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Date: {order.orderDate} | Total: ₹{order.totalAmount}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
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
                            className="text-xs sm:text-sm"
                          >
                            <Printer className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Print</span>
                          </Button>
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => markAsPacked(order.id)}
                              className="bg-gradient-pink text-xs sm:text-sm"
                            >
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Mark Packed</span>
                              <span className="sm:hidden">Pack</span>
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

        {activeTab === 'packed' && (
          <div className="space-y-6">
            {/* Packed Orders List */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Packed Orders ({packedOrders.length})
                  {selectedDateFilter !== 'all' && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedDateFilter === 'today' ? 'Today' :
                       selectedDateFilter === 'yesterday' ? 'Yesterday' :
                       selectedDateFilter === 'thisWeek' ? 'This Week' :
                       selectedDateFilter === 'thisMonth' ? 'This Month' : selectedDateFilter}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {packedOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground">
                            <MapPin className="inline h-4 w-4 mr-1" />
                            <span className="font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                              {order.branchName} ({order.branchCode})
                            </span>
                            <span className="ml-2">- {order.franchiseName}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {order.orderDate} | Total: ₹{order.totalAmount}
                          </p>
                          {order.packedDate && (
                            <p className="text-sm text-green-600 font-medium">
                              Packed on: {order.packedDate} by {order.packedBy}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Packed
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => printOrder(order)}
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </Button>
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
                  {packedOrders.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No packed orders found.</p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                      <div className="text-sm text-muted-foreground mb-4">
                        Sold: {product.sold} units
                      </div>
                      
                      {/* Stock Management Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2">
                        {product.stock > 0 ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => markOutOfStock(product.id)}
                            className="flex-1 text-xs sm:text-sm"
                          >
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Mark Out of Stock</span>
                            <span className="sm:hidden">Out of Stock</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => restockProduct(product.id)}
                            className="flex-1 text-xs sm:text-sm"
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Restock (50 units)</span>
                            <span className="sm:hidden">Restock</span>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newStock = prompt(`Enter new stock quantity for ${product.name}:`, product.stock.toString());
                            if (newStock !== null && !isNaN(Number(newStock)) && Number(newStock) >= 0) {
                              updateProductStock(product.id, Number(newStock));
                            }
                          }}
                          className="text-xs sm:text-sm"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <FactoryAnalytics 
            factoryId={user?.factoryId} 
            factoryType={user?.factoryType}
            selectedBranch={selectedBranch}
            selectedDateFilter={selectedDateFilter}
          />
        )}
      </div>
    </div>
  );
};

export default FactoryDashboard;
