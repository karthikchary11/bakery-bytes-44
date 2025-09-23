import React, { useState } from 'react';
import { factoryDashboardData, getAnalyticsByPeriod } from '../data/factoryDashboardData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  getFactoryOrdersByFactory, 
  getFactoryOrdersByBranch,
  getFactoryOrdersByStatus 
} from '../data/factoryOrders';
import { fakeProducts } from '../data/products';
import { TrendingUp, Package, DollarSign, MapPin, Clock, CheckCircle, Calendar } from 'lucide-react';

interface FactoryAnalyticsProps {
  factoryId: number;
  factoryType: string;
  selectedBranch?: string;
  selectedDateFilter?: string;
}

const FactoryAnalytics = ({ factoryId, factoryType, selectedBranch, selectedDateFilter }: FactoryAnalyticsProps) => {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('month');
  
  // Use comprehensive analytics data
  const analytics = factoryDashboardData.analytics;

  // Use comprehensive data
  const factoryOrders = factoryDashboardData.factoryOrders;
  const factoryProducts = factoryDashboardData.factoryProducts;

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

  // Time period filtering for analytics
  const getTimeFilteredData = (data: any[]) => {
    const now = new Date();
    
    switch (selectedTimePeriod) {
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return data.filter(item => new Date(item.date || item.orderDate) >= weekAgo);
        
      case 'month':
        return data.filter(item => {
          const itemDate = new Date(item.date || item.orderDate);
          return itemDate.getMonth() === now.getMonth() && 
                 itemDate.getFullYear() === now.getFullYear();
        });
        
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        return data.filter(item => new Date(item.date || item.orderDate) >= quarterStart);
        
      case 'year':
        return data.filter(item => {
          const itemDate = new Date(item.date || item.orderDate);
          return itemDate.getFullYear() === now.getFullYear();
        });
        
      default:
        return data;
    }
  };

  // Apply filters
  let filteredOrders = getDateFilteredOrders(factoryOrders);
  if (selectedBranch && selectedBranch !== 'all') {
    filteredOrders = filteredOrders.filter(order => order.branchId.toString() === selectedBranch);
  }
  filteredOrders = getTimeFilteredData(filteredOrders);

  // Prepare data for charts
  const branchData = filteredOrders.reduce((acc, order) => {
    const branchName = order.branchName;
    if (!acc[branchName]) {
      acc[branchName] = { orders: 0, revenue: 0 };
    }
    acc[branchName].orders += 1;
    acc[branchName].revenue += order.totalAmount;
    return acc;
  }, {});

  const branchChartData = Object.entries(branchData).map(([branch, data]) => ({
    branch,
    orders: data.orders,
    revenue: data.revenue
  }));

  const statusData = [
    { status: 'Pending', count: getFactoryOrdersByStatus(factoryId, 'pending').length, color: 'hsl(var(--accent))' },
    { status: 'Packed', count: getFactoryOrdersByStatus(factoryId, 'packed').length, color: 'hsl(var(--primary))' },
    { status: 'Shipped', count: getFactoryOrdersByStatus(factoryId, 'shipped').length, color: 'hsl(var(--bakery-chocolate))' },
    { status: 'Delivered', count: getFactoryOrdersByStatus(factoryId, 'delivered').length, color: 'hsl(var(--bakery-berry))' }
  ];

  const monthlyData = [
    { month: 'Jan', orders: 12, revenue: 45000 },
    { month: 'Feb', orders: 18, revenue: 67000 },
    { month: 'Mar', orders: 15, revenue: 52000 },
    { month: 'Apr', orders: 22, revenue: 78000 },
    { month: 'May', orders: 19, revenue: 65000 },
    { month: 'Jun', orders: 25, revenue: 89000 },
  ];

  const productPerformance = factoryProducts.map(product => ({
    name: product.name,
    sold: product.sold,
    revenue: product.sold * product.price,
    stock: product.stock
  }));

  // Use analytics data from comprehensive dataset
  const totalRevenue = analytics.summary.totalRevenue;
  const totalOrders = analytics.summary.totalOrders;
  const avgOrderValue = analytics.summary.averageOrderValue;
  const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length;

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--accent))"
    },
    sold: {
      label: "Units Sold",
      color: "hsl(var(--primary))"
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Period Filter */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Analytics Period:</h3>
            <select
              value={selectedTimePeriod}
              onChange={(e) => setSelectedTimePeriod(e.target.value)}
              className="p-2 border rounded-md bg-background"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            {selectedDateFilter && selectedDateFilter !== 'all' && (
              <span className="text-sm text-muted-foreground">
                + {selectedDateFilter === 'today' ? 'Today' :
                   selectedDateFilter === 'yesterday' ? 'Yesterday' :
                   selectedDateFilter === 'thisWeek' ? 'This Week' :
                   selectedDateFilter === 'thisMonth' ? 'This Month' : selectedDateFilter} filter
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">+15% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold text-primary">{totalOrders}</p>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold text-primary">₹{Math.round(avgOrderValue)}</p>
                <p className="text-xs text-green-600">+5% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                <p className="text-2xl font-bold text-accent">{pendingOrders}</p>
                <p className="text-xs text-orange-600">Needs attention</p>
              </div>
              <Clock className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Orders by Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={branchChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="branch" 
                    fontSize={12}
                    tickFormatter={(value) => value.split(' ')[0]}
                  />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  <div className="w-full lg:w-2/3">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={20}
                        dataKey="count"
                        label={false}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value, name) => [value, name]}
                      />
                    </PieChart>
                  </div>
                  <div className="w-full lg:w-1/3 space-y-2">
                    {statusData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-sm font-medium text-foreground">
                          {entry.status}: {entry.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Monthly Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="orders" fill="hsl(var(--accent))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product Performance Table */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Product Performance - {factoryType.toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Units Sold</th>
                  <th className="text-left p-2">Revenue</th>
                  <th className="text-left p-2">Current Stock</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {productPerformance.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{product.name}</td>
                    <td className="p-2">{product.sold}</td>
                    <td className="p-2">₹{product.revenue.toLocaleString()}</td>
                    <td className="p-2">{product.stock}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.stock > 10 ? 'bg-green-100 text-green-800' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 10 ? 'In Stock' :
                         product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Branch Performance */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Branch Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {branchChartData.map((branch) => (
              <div key={branch.branch} className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">{branch.branch}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Orders:</span>
                    <span className="font-medium">{branch.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Revenue:</span>
                    <span className="font-medium">₹{branch.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Order:</span>
                    <span className="font-medium">₹{Math.round(branch.revenue / branch.orders)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FactoryAnalytics;
