import React, { useMemo, useState } from 'react';
import { Container } from '@mui/material';
import { useProductStore } from '../../stores/productStore';
import { useAuthStore } from '../../stores/authStore';
import { useTransactionStore } from '../../stores/transactionStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { formatCurrency } from '@/utils/currencyFormatter';
import { Bar, BarChart, Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, LabelList } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { TrendingUp } from "lucide-react";
import { generateMockTransactions } from '@/mocks/dashboardData';

export default function AdminDashboard() {
  const { products, getTrendingProducts } = useProductStore();
  const { users } = useAuthStore();
  const { transactions } = useTransactionStore();

  const [activeTimeframe, setActiveTimeframe] = useState<'weekly' | 'monthly'>('monthly');

  const trendingProducts = getTrendingProducts().slice(0, 5);

  const last30Days = useMemo(() => {
    return [...Array(30)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
  }, []);

  const mockTransactions = useMemo(() => generateMockTransactions(), []);

  const allTransactions = useMemo(() => [...transactions, ...mockTransactions], [transactions, mockTransactions]);

  const dailyRevenue = useMemo(() => {
    return last30Days.map(date => ({
      date,
      revenue: allTransactions
        .filter(t => t.date.toISOString().split('T')[0] === date)
        .reduce((sum, t) => sum + t.total, 0)
    }));
  }, [last30Days, allTransactions]);

  const topCategories = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  const categoryData = Object.entries(topCategories)
    .map(([category, count]) => ({
      category,
      count: count as number
    }))
    .sort((a, b) => (b.count as number) - (a.count as number))
    .slice(0, 6);

  const chartConfig = {
    weekly: {
      label: "Weekly Revenue",
      color: "hsl(var(--chart-1))",
    },
    monthly: {
      label: "Monthly Revenue",
      color: "hsl(var(--chart-2))",
    },
  };

  const weeklyRevenue = useMemo(() => {
    const lastWeek = last30Days.slice(-7);
    return lastWeek.map(date => ({
      date,
      revenue: allTransactions
        .filter(t => t.date.toISOString().split('T')[0] === date)
        .reduce((sum, t) => sum + t.total, 0)
    }));
  }, [last30Days, allTransactions]);

  const monthlyRevenue = dailyRevenue;

  const totalRevenueByTimeframe = useMemo(() => ({
    weekly: weeklyRevenue.reduce((acc, curr) => acc + curr.revenue, 0),
    monthly: allTransactions.reduce((acc, curr) => acc + curr.total, 0),
  }), [weeklyRevenue, allTransactions]);

  const calculateRevenueGrowth = (data: typeof weeklyRevenue) => {
    const currentRevenue = data.reduce((sum, day) => sum + day.revenue, 0);
    const previousRevenue = allTransactions
      .filter(t => t.date < new Date(data[0].date))
      .slice(0, data.length)
      .reduce((sum, t) => sum + t.total, 0);
    
    if (previousRevenue === 0) {
      return currentRevenue > 0 ? 100 : 0;
    }
    
    const growthRate = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    return isNaN(growthRate) ? 0 : parseFloat(growthRate.toFixed(1));
  };

  const revenueGrowth = useMemo(() => ({
    weekly: calculateRevenueGrowth(weeklyRevenue),
    monthly: calculateRevenueGrowth(dailyRevenue),
  }), [weeklyRevenue, dailyRevenue, calculateRevenueGrowth]);

  const activeUsers = Math.floor(users.length * 0.1); // Assuming 10% of users are active

  return (
    <Container maxWidth="lg" className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date(last30Days[0]).toLocaleDateString()} - {new Date(last30Days[last30Days.length - 1]).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenueByTimeframe.monthly)}</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 1 0-7.75"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">+5% since last hour</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Showing {activeTimeframe} revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex mb-4">
              {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map((key) => (
                <button
                  key={key}
                  data-active={activeTimeframe === key}
                  className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                  onClick={() => setActiveTimeframe(key)}
                >
                  <span className="text-xs text-muted-foreground">
                    {chartConfig[key].label}
                  </span>
                  <span className="text-lg font-bold leading-none sm:text-3xl">
                    {formatCurrency(totalRevenueByTimeframe[key])}
                  </span>
                </button>
              ))}
            </div>
            <ChartContainer config={chartConfig}>
              <AreaChart
                data={activeTimeframe === 'weekly' ? weeklyRevenue : dailyRevenue}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={chartConfig[activeTimeframe].color} 
                  fill={chartConfig[activeTimeframe].color} 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              {typeof revenueGrowth[activeTimeframe] === 'number' ? (
                <>
                  Trending {revenueGrowth[activeTimeframe] > 0 ? 'up' : 'down'} by {Math.abs(revenueGrowth[activeTimeframe])}% this {activeTimeframe === 'weekly' ? 'week' : 'month'}
                  <TrendingUp className={`h-4 w-4 ${revenueGrowth[activeTimeframe] > 0 ? 'text-green-500' : 'text-red-500'}`} />
                </>
              ) : (
                <>
                  No change in revenue this {activeTimeframe === 'weekly' ? 'week' : 'month'}
                  <TrendingUp className="h-4 w-4 text-yellow-500" />
                </>
              )}
            </div>
            <div className="leading-none text-muted-foreground">
              {new Date(last30Days[0]).toLocaleDateString()} - {new Date(last30Days[last30Days.length - 1]).toLocaleDateString()}
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>Top 6 categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{
                  right: 16,
                }}
              >
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="category"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  hide
                />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Bar
                  dataKey="count"
                  fill={chartConfig.monthly.color}
                  radius={4}
                >
                  <LabelList
                    dataKey="category"
                    position="insideLeft"
                    offset={8}
                    className="fill-[--color-label]"
                    fontSize={12}
                  />
                  <LabelList
                    dataKey="count"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="flex gap-2 font-medium leading-none">
              {categoryData[0].category} is the top category
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="leading-none text-muted-foreground">
              Showing top 6 product categories
            </div>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Trending Products</CardTitle>
          <CardDescription>Top 5 selling products this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {trendingProducts.map((product) => (
              <div key={product.id} className="flex items-center space-x-4">
                <img
                  src={product.coverImage}
                  alt={product.name}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div className="flex-grow">
                  <p className="text-sm font-medium leading-none">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <span key={variant.sku} className="text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-1">
                        {variant.size} - {variant.color}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(product.variants[0].price)}</p>
                  <p className="text-sm text-muted-foreground">Stock: {product.variants.reduce((total, v) => total + v.stock, 0)}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}