import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { fakeProducts } from '../data/products';
import { fakeOrders } from '../data/orders';
import { TrendingUp, Package, DollarSign, Users, Calendar } from 'lucide-react';

interface AnalyticsDashboardProps {
  selectedTimePeriod?: string;
}

const AnalyticsDashboard = ({ selectedTimePeriod: propSelectedTimePeriod = 'month' }: AnalyticsDashboardProps) => {
  const [analyticsPeriod, setAnalyticsPeriod] = useState('month');

  // Analytics period filtering function (separate from AdminDashboard time period)
  const getAnalyticsFilteredData = (data: any[], dateKey: string = 'orderDate') => {
    const now = new Date();
    
    switch (analyticsPeriod) {
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return data.filter(item => new Date(item[dateKey]) >= weekAgo);
      }
        
      case 'month':
        return data.filter(item => {
          const itemDate = new Date(item[dateKey]);
          return itemDate.getMonth() === now.getMonth() && 
                 itemDate.getFullYear() === now.getFullYear();
        });
        
      case 'quarter': {
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        return data.filter(item => new Date(item[dateKey]) >= quarterStart);
      }
        
      case 'year':
        return data.filter(item => {
          const itemDate = new Date(item[dateKey]);
          return itemDate.getFullYear() === now.getFullYear();
        });
        
      default:
        return data;
    }
  };

  // Generate dynamic monthly data based on analytics period
  const generateMonthlyData = () => {
    const now = new Date();
    const months = [];
    
    switch (analyticsPeriod) {
      case 'week': {
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          months.push({
            month: dayName,
            revenue: Math.floor(Math.random() * 20000) + 10000,
            orders: Math.floor(Math.random() * 30) + 15
          });
        }
        break;
      }
      case 'month': {
        // Last 4 weeks of current month
        for (let i = 3; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(now.getDate() - (i * 7));
          const weekNum = Math.ceil(date.getDate() / 7);
          months.push({
            month: `Week ${weekNum}`,
            revenue: Math.floor(Math.random() * 25000) + 15000,
            orders: Math.floor(Math.random() * 40) + 20
          });
        }
        break;
      }
      case 'quarter': {
        // Last 3 months
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 2; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - i);
          months.push({
            month: monthNames[date.getMonth()],
            revenue: Math.floor(Math.random() * 50000) + 30000,
            orders: Math.floor(Math.random() * 80) + 40
          });
        }
        break;
      }
      case 'year': {
        // Last 6 months
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - i);
          months.push({
            month: monthNames[date.getMonth()],
            revenue: Math.floor(Math.random() * 40000) + 25000,
            orders: Math.floor(Math.random() * 60) + 30
          });
        }
        break;
      }
    }
    return months;
  };

  // Prepare data for charts
  const productSalesData = fakeProducts.map(product => ({
    name: product.name,
    sold: product.sold,
    revenue: product.sold * product.price,
    category: product.category
  }));

  const monthlyRevenue = generateMonthlyData();

  const categoryData = [
    { category: 'Biscuits', revenue: 120000, orders: 240 },
    { category: 'Cakes', revenue: 85000, orders: 170 },
    { category: 'Breads', revenue: 65000, orders: 130 },
    { category: 'Chocolate', revenue: 45000, orders: 90 },
    { category: 'Namkeen', revenue: 35000, orders: 70 },
    { category: 'Sweets', revenue: 40000, orders: 80 },
    { category: 'Gift Hampers', revenue: 25000, orders: 50 },
  ];

  const topProducts = productSalesData
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  const filteredFakeOrders = getAnalyticsFilteredData(fakeOrders);
  const totalRevenue = filteredFakeOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredFakeOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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
    <div className="space-y-4 sm:space-y-6">
      {/* Analytics Period Filter */}
      <Card className="shadow-soft">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h3 className="text-sm sm:text-lg font-semibold">Analytics Period:</h3>
            </div>
            <select
              value={analyticsPeriod}
              onChange={(e) => setAnalyticsPeriod(e.target.value)}
              className="p-2 border rounded-md bg-background text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Showing analytics for: {analyticsPeriod === 'week' ? 'This Week' :
               analyticsPeriod === 'month' ? 'This Month' :
               analyticsPeriod === 'quarter' ? 'This Quarter' : 'This Year'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="shadow-soft">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">+15% from last period</p>
              </div>
              <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">{totalOrders}</p>
                <p className="text-xs text-green-600">+8% from last period</p>
              </div>
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-lg sm:text-2xl font-bold text-primary">₹{Math.round(avgOrderValue)}</p>
                <p className="text-xs text-green-600">+5% from last period</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-xl sm:text-2xl font-bold text-primary">1,247</p>
                <p className="text-xs text-green-600">+12% from last period</p>
              </div>
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    fontSize={12}
                    tickFormatter={(value) => value.split(' ')[0]}
                  />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    tickFormatter={(value) => value.split(' ')[0]}
                  />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sold" fill="hsl(var(--accent))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Revenue Trend - {analyticsPeriod === 'week' ? 'Daily' : 
              analyticsPeriod === 'month' ? 'Weekly' : 
              analyticsPeriod === 'quarter' ? 'Monthly' : 'Monthly'}</CardTitle>
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
            <CardTitle>Orders Trend - {analyticsPeriod === 'week' ? 'Daily' : 
              analyticsPeriod === 'month' ? 'Weekly' : 
              analyticsPeriod === 'quarter' ? 'Monthly' : 'Monthly'}</CardTitle>
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
                      <span className={`px-2 py-1 rounded text-xs ${
                        product.sold > 100 ? 'bg-green-100 text-green-800' :
                        product.sold > 50 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.sold > 100 ? 'High' :
                         product.sold > 50 ? 'Medium' : 'Low'}
                      </span>
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