import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { 
  getFactoryOrdersByFactory, 
  getFactoryOrdersByBranch,
  getFactoryOrdersByStatus 
} from '../data/factoryOrders';
import { fakeProducts } from '../data/products';
import { TrendingUp, Package, DollarSign, MapPin, Clock, CheckCircle } from 'lucide-react';

interface FactoryAnalyticsProps {
  factoryId: number;
  factoryType: string;
}

const FactoryAnalytics = ({ factoryId, factoryType }: FactoryAnalyticsProps) => {
  // Get factory-specific data
  const factoryOrders = getFactoryOrdersByFactory(factoryId);
  const factoryProducts = fakeProducts.filter(p => {
    const categoryMapping = {
      "chocolate": "Chocolate",
      "biscuit": "Biscuits", 
      "cake": "Cakes",
      "namkeen": "Namkeen",
      "sweets": "Sweets",
      "gift_hamper": "Gift Hampers"
    };
    return categoryMapping[factoryType] === p.category;
  });

  // Prepare data for charts
  const branchData = factoryOrders.reduce((acc, order) => {
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

  const totalRevenue = factoryOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = factoryOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const pendingOrders = getFactoryOrdersByStatus(factoryId, 'pending').length;

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
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
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
