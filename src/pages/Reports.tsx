import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter } from 'lucide-react';
import { useSales } from '../hooks/useSales';
import { useProducts } from '../hooks/useProducts';

const Reports = () => {
  const { t } = useTranslation();
  const { sales } = useSales();
  const { products } = useProducts();
  const [timeFilter, setTimeFilter] = useState('all');
  const [monthlySales, setMonthlySales] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [revenueContribution, setRevenueContribution] = useState([]);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#6366F1', '#gray'];

  const filterSalesByTime = (sales) => {
    const now = new Date();
    return sales.filter(sale => {
      const saleDate = new Date(sale.created_at);
      switch (timeFilter) {
        case 'daily':
          return saleDate.toDateString() === now.toDateString();
        case 'weekly':
          return saleDate >= new Date(now - 7 * 24 * 60 * 60 * 1000);
        case 'monthly':
          return saleDate.getMonth() === now.getMonth() && 
                 saleDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  useEffect(() => {
    if (sales && products) {
      const filteredSales = filterSalesByTime(sales);

      // Process monthly sales data
      const monthlyData = filteredSales.reduce((acc, sale) => {
        const date = new Date(sale.created_at);
        const month = date.toLocaleString('default', { month: 'long' });
        acc[month] = (acc[month] || 0) + Number(sale.total);
        return acc;
      }, {});

      setMonthlySales(Object.entries(monthlyData).map(([month, revenue]) => ({
        month,
        revenue
      })));

      // Process category distribution
      const categoryData = filteredSales.reduce((acc, sale) => {
        sale.sale_items.forEach(item => {
          const product = products.find(p => p.id === item.product_id);
          if (product) {
            acc[product.category] = (acc[product.category] || 0) + Number(item.price_at_sale * item.quantity);
          }
        });
        return acc;
      }, {});

      const totalSales = Object.values(categoryData).reduce((sum: any, value: any) => sum + value, 0);
      
      setCategoryDistribution(
        Object.entries(categoryData).map(([name, value]: [string, any]) => ({
          name: t(`products.categories.${name}`),
          value: (value / totalSales) * 100
        }))
      );

      // Process revenue contribution by product
      const productRevenue = filteredSales.reduce((acc, sale) => {
        sale.sale_items.forEach(item => {
          const product = products.find(p => p.id === item.product_id);
          if (product) {
            acc[product.name] = (acc[product.name] || 0) + Number(item.price_at_sale * item.quantity);
          }
        });
        return acc;
      }, {});

      const sortedProducts = Object.entries(productRevenue)
        .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
        .slice(0, 5);

      const otherRevenue = Object.entries(productRevenue)
        .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
        .slice(5)
        .reduce((sum, [, value]) => sum + value, 0);

      setRevenueContribution([
        ...sortedProducts.map(([name, value]: [string, any]) => ({
          name,
          value: (value / totalSales) * 100
        })),
        {
          name: t('reports.others'),
          value: (otherRevenue / totalSales) * 100
        }
      ]);
    }
  }, [sales, products, t, timeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">{t('reports.title')}</h1>
        <div className="flex items-center gap-4">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="rounded-lg border-gray-300 shadow-sm"
          >
            <option value="all">{t('reports.filters.allTime')}</option>
            <option value="daily">{t('reports.filters.daily')}</option>
            <option value="weekly">{t('reports.filters.weekly')}</option>
            <option value="monthly">{t('reports.filters.monthly')}</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
            <Download className="w-5 h-5 mr-2" />
            {t('common.export')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('reports.monthlyRevenue')}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="revenue" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t('reports.salesByCategory')}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value.toFixed(1)}%)`}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">{t('reports.revenueContribution')}</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueContribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value.toFixed(1)}%)`}
                >
                  {revenueContribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
