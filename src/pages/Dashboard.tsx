import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useSales } from '../hooks/useSales';
import { useReports } from '../hooks/useReports';

const Dashboard = () => {
  const { products } = useProducts();
  const { sales } = useSales();
  const { monthlySales } = useReports();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    growth: 0
  });

  useEffect(() => {
    if (sales && products) {
      // Calculate stats
      const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.total), 0);
      const lowStockCount = products.filter(p => p.quantity <= p.min_stock_level).length;
      
      // Calculate growth (comparing current month to previous month)
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const currentMonthSales = sales
        .filter(sale => {
          const saleDate = new Date(sale.created_at);
          return saleDate.getMonth() === currentMonth && 
                 saleDate.getFullYear() === currentYear;
        })
        .reduce((sum, sale) => sum + Number(sale.total), 0);
      
      const previousMonthSales = sales
        .filter(sale => {
          const saleDate = new Date(sale.created_at);
          return saleDate.getMonth() === (currentMonth - 1) && 
                 saleDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear);
        })
        .reduce((sum, sale) => sum + Number(sale.total), 0);
      
      const growth = previousMonthSales ? 
        ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100 : 
        0;

      setStats({
        totalSales: sales.length,
        totalRevenue: totalRevenue,
        lowStockItems: lowStockCount,
        growth: growth
      });
    }
  }, [sales, products]);

  // Process weekly sales data
  const weeklySales = sales?.reduce((acc, sale) => {
    const date = new Date(sale.created_at);
    const week = `Week ${Math.ceil(date.getDate() / 7)}`;
    acc[week] = (acc[week] || 0) + Number(sale.total);
    return acc;
  }, {}) || {};

  const salesData = Object.entries(weeklySales).map(([name, value]) => ({
    name,
    sales: value
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Sales"
          value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Number of Sales"
          value={stats.totalSales}
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          color="bg-red-500"
        />
        <StatCard
          title="Growth"
          value={`${stats.growth.toFixed(1)}%`}
          icon={Package}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Weekly Sales</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Bar dataKey="sales" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-full`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default Dashboard;
