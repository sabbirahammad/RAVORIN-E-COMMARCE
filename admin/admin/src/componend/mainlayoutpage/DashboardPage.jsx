import { ShoppingCart, DollarSign, Package, Users, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const statConfig = [
  {
    key: 'orders',
    label: 'Total Orders',
    icon: ShoppingCart,
    tone: 'bg-cyan-50 text-cyan-700',
  },
  {
    key: 'sales',
    label: 'Total Sales',
    icon: DollarSign,
    tone: 'bg-emerald-50 text-emerald-700',
  },
  {
    key: 'products',
    label: 'Products in Stock',
    icon: Package,
    tone: 'bg-amber-50 text-amber-700',
  },
  {
    key: 'customers',
    label: 'Total Customers',
    icon: Users,
    tone: 'bg-violet-50 text-violet-700',
  },
];

const quickActions = [
  { label: 'Add Product', shortLabel: 'Add', path: '/add-product', className: 'bg-cyan-600 text-white hover:bg-cyan-700' },
  { label: 'View Orders', shortLabel: 'Orders', path: '/orders', className: 'bg-emerald-600 text-white hover:bg-emerald-700' },
  { label: 'Manage Stock', shortLabel: 'Stock', path: '/products', className: 'bg-amber-400 text-slate-950 hover:bg-amber-300' },
  { label: 'Customers', shortLabel: 'Users', path: '/customers', className: 'bg-violet-600 text-white hover:bg-violet-700' },
  { label: 'Home Category', shortLabel: 'Home Cat', path: '/category', className: 'bg-indigo-600 text-white hover:bg-indigo-700' },
  { label: 'Top Category', shortLabel: 'Top Cat', path: '/allcategories', className: 'bg-fuchsia-600 text-white hover:bg-fuchsia-700' },
  { label: 'Sub Category', shortLabel: 'Sub Cat', path: '/subcategory', className: 'bg-teal-600 text-white hover:bg-teal-700' },
  { label: 'Hero Image', shortLabel: 'Hero', path: '/image', className: 'bg-orange-500 text-white hover:bg-orange-600' },
];

const recentActivity = [
  'Order #1024 marked as completed',
  'Modern Hoodie was added to products',
  'A new customer account was created',
  'Stock was updated for Winter Jacket',
];

const DashboardPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    orders: {
      totalOrders: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      dailyRevenue: [],
    },
    products: {
      totalProducts: 0,
    },
    users: {
      totalUsers: 0,
    },
  });
  const [animatedStats, setAnimatedStats] = useState({
    orders: 0,
    sales: 0,
    products: 0,
    customers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setError('No admin token found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const orderResponse = await fetch('https://apii.ravorin.com/api/v1/orders/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const productResponse = await fetch('https://apii.ravorin.com/api/v1/products/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const userResponse = await fetch('https://apii.ravorin.com/api/v1/user/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!orderResponse.ok || !productResponse.ok || !userResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const orderData = await orderResponse.json();
        const productData = await productResponse.json();
        const userData = await userResponse.json();

        if (orderData.success && productData.success && userData.success) {
          setDashboardData({
            orders: {
              totalOrders: orderData.stats.totalOrders,
              totalRevenue: orderData.stats.totalRevenue,
              monthlyRevenue: orderData.stats.monthlyRevenue,
              dailyRevenue: orderData.stats.dailyRevenue || [],
            },
            products: {
              totalProducts: productData.stats.totalProducts,
            },
            users: {
              totalUsers: userData.stats.totalUsers,
            },
          });
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    const targets = {
      orders: dashboardData.orders.totalOrders,
      sales: dashboardData.orders.totalRevenue,
      products: dashboardData.products.totalProducts,
      customers: dashboardData.users.totalUsers,
    };

    setAnimatedStats({
      orders: 0,
      sales: 0,
      products: 0,
      customers: 0,
    });

    const interval = setInterval(() => {
      setAnimatedStats((prev) => {
        const next = { ...prev };
        let complete = true;

        Object.keys(targets).forEach((key) => {
          const target = targets[key];
          const step = Math.max(1, Math.ceil(target / 30));
          if (next[key] < target) {
            next[key] = Math.min(target, next[key] + step);
            complete = false;
          }
        });

        if (complete) {
          clearInterval(interval);
        }

        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [dashboardData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard</h2>
        <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-500" />
            <p className="text-sm text-slate-500">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard</h2>
        <div className="rounded-3xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Error loading dashboard</h3>
          <p className="mt-2 text-sm text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Overview
            </div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin Dashboard</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Clean overview of orders, sales, products, and customers. The layout is simplified for desktop and mobile.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Orders</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{dashboardData.orders.totalOrders}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Revenue</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                Tk {dashboardData.orders.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statConfig.map((stat) => {
          const value =
            stat.key === 'orders'
              ? animatedStats.orders
              : stat.key === 'sales'
                ? animatedStats.sales
                : stat.key === 'products'
                  ? animatedStats.products
                  : animatedStats.customers;

          return (
            <div
              key={stat.key}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-cyan-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">
                    {stat.key === 'sales' ? `Tk ${Number(value).toLocaleString()}` : Number(value).toLocaleString()}
                  </p>
                </div>
                <div className={`rounded-2xl p-3 ${stat.tone}`}>
                  <stat.icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.95fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Revenue Analytics</h3>
              <p className="text-sm text-slate-500">A quick summary of sales performance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
              <p className="text-sm text-slate-600">Total Revenue</p>
              <p className="mt-2 text-2xl font-bold text-cyan-700">
                Tk {dashboardData.orders.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-sm text-slate-600">Monthly Revenue</p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">
                Tk {dashboardData.orders.monthlyRevenue.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-sm text-slate-600">Total Orders</p>
              <p className="mt-2 text-2xl font-bold text-violet-700">{dashboardData.orders.totalOrders}</p>
            </div>
          </div>

          {dashboardData.orders.dailyRevenue.length > 0 ? (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">Recent Daily Revenue</h4>
              <div className="space-y-2">
                {dashboardData.orders.dailyRevenue.slice(0, 8).map((day, index) => (
                  <div
                    key={`${day._id.year}-${day._id.month}-${day._id.day}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm"
                  >
                    <span className="text-slate-600">
                      {new Date(day._id.year, day._id.month - 1, day._id.day).toLocaleDateString()}
                    </span>
                    <span className="font-semibold text-slate-900">Tk {day.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
              <h4 className="text-sm font-semibold text-slate-900">No revenue data yet</h4>
              <p className="mt-2 text-sm text-slate-500">Revenue details will appear here once orders are processed.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                <p className="text-sm text-slate-500">Shortcuts for common admin tasks.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className={`rounded-2xl px-3 py-3 text-sm font-medium transition-colors ${action.className}`}
                >
                  <span className="hidden sm:inline">{action.label}</span>
                  <span className="sm:hidden">{action.shortLabel}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                <p className="text-sm text-slate-500">Static summary items for quick reference.</p>
              </div>
            </div>

            <ul className="space-y-3">
              {recentActivity.map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                >
                  <span>{item}</span>
                  <ArrowRight size={16} className="shrink-0 text-slate-400" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
