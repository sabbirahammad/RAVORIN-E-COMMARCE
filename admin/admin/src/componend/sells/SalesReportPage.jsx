// SalesReportPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const SalesReportPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('https://apii.ravorin.com/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch sales data:', err);
      }
    };
    fetchOrders();
  }, []);

  // Group sales by month for chart
  const salesByMonth = orders.reduce((acc, order) => {
    const month = new Date(order.date).toLocaleString('default', { month: 'short' });
    acc[month] = (acc[month] || 0) + Number(order.total);
    return acc;
  }, {});

  const chartData = Object.entries(salesByMonth).map(([month, total]) => ({ month, total }));

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Sales Report</h2>

      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-xl font-bold">{orders.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold">
            ৳{orders.reduce((acc, o) => acc + Number(o.total), 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Completed Orders</p>
          <p className="text-xl font-bold">
            {orders.filter(o => o.status === 'completed').length}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Pending Orders</p>
          <p className="text-xl font-bold">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesReportPage;
