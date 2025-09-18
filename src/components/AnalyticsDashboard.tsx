import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { fakeProducts } from '../data/products';
import { fakeOrders } from '../data/orders';
import { TrendingUp, Package, DollarSign, Users } from 'lucide-react';

const AnalyticsDashboard = () => {
  // Prepare data for charts
  const productSalesData = fakeProducts.map(product => ({
    name: product.name,
    sold: product.sold,
    revenue: product.sold * product.price,
    category: product.category
  }));

  const monthlyRevenue = [
    { month: 'Jan', revenue: 45000, orders: 89 },
    { month: 'Feb', revenue: 52000, orders: 94 },
    { month: 'Mar', revenue: 48000, orders: 76 },
    { month: 'Apr', revenue: 61000, orders: 103 },
    { month: 'May', revenue: 55000, orders: 87 },
    { month: 'Jun', revenue: 67000, orders: 112 },
  ];

  const categoryData = [
    { category: 'Biscuits', value: 35, color: 'hsl(var(--primary))' },
    { category: 'Cakes', value: 25, color: 'hsl(var(--accent))' },
    { category: 'Breads', value: 20, color: 'hsl(var(--bakery-chocolate))' },
    { category: 'Pastries', value: 20, color: 'hsl(var(--bakery-berry))' }
  ];

  const topProducts = productSalesData
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const totalRevenue = fakeOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = fakeOrders.length;
  const avgOrderValue = totalRevenue / totalOrders;

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
                <p className="text-xs text-green-600">+12% from last month</p>
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
                <p className="text-sm font-medium text-muted-foreground">Active Franchises</p>
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-xs text-green-600">+1 new this month</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    tickFormatter={(value) => value.split(' ').slice(0, 2).join(' ')}
                  />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sold" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ category, value }) => `${category}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
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
                <LineChart data={monthlyRevenue}>
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
                <BarChart data={monthlyRevenue}>
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
          <CardTitle>Product Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Units Sold</th>
                  <th className="text-left p-2">Revenue</th>
                  <th className="text-left p-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {productSalesData.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">{product.name}</td>
                    <td className="p-2">{product.category}</td>
                    <td className="p-2">{product.sold}</td>
                    <td className="p-2">₹{product.revenue.toLocaleString()}</td>
                    <td className="p-2">
                      {fakeProducts.find(p => p.name === product.name)?.stock || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;