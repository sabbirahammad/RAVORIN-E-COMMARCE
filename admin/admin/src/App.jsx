import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminLogin from './componend/auth/AdminLogin';
import AdminLayout from './componend/mainlayoutpage/AdminLayout';
import DashboardPage from './componend/mainlayoutpage/DashboardPage';
import ProductListPage from './componend/products/ProductListPage';
import AddProductForm from './componend/products/AddProductForm';
import CustomerListPage from './componend/castomar/CustomerListPage';
import OrderListPage from './componend/products/OrderListPage';
import OrderDetailsPage from './componend/orders/OrderDetailsPage';
import AdminOrdersPage from './componend/orders/AdminOrdersPage';
import SalesReportPage from './componend/sells/SalesReportPage';
import RefundRequestPage from './componend/sells/RefundRequestPage';
import AdminSettingsPage from './componend/settingsPage/AdminSettingsPage';
import DeliveryCostSettings from './componend/settingsPage/DeliveryCostSettings';
import CouponListPage from './componend/coupon/CouponListPage';
import AddCouponPage from './componend/coupon/AddCouponPage';
import EditCouponPage from './componend/coupon/EditCouponPage';
import MessageListPage from './componend/messages/MessageListPage';
import AdminCategories from './componend/Catagory/AdminCategories';
import AdminAllCategories from './componend/Catagory/AdminAllCategories';
import AdminSubCategory from './componend/Catagory/AdminSubCategory';
import AdminCategoryMenu from './componend/Catagory/AdminSubCategory';
import ImageUpload from './componend/products/Image';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main App Component
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route - login */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <AdminLogin />}
        />

        {/* Protected routes - admin panel */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="add-product" element={<AddProductForm />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="admin/orders" element={<AdminOrdersPage />} />
          <Route path="admin/orders/:id" element={<OrderDetailsPage />} />
          <Route path="reports" element={<SalesReportPage />} />
          <Route path="refunds" element={<RefundRequestPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="delivery-costs" element={<DeliveryCostSettings />} />
          <Route path="coupons" element={<CouponListPage />} />
          <Route path="coupons/add" element={<AddCouponPage />} />
          <Route path="coupons/edit/:id" element={<EditCouponPage />} />
          <Route path="messages" element={<MessageListPage />} />
          <Route path='category' element={<AdminCategories/>}/>
          <Route path='allcategories' element={<AdminAllCategories/>}/>
          <Route path="subcategory" element={<AdminCategoryMenu/>} />
          <Route path='/image' element={<ImageUpload/>}/>
        </Route>

        {/* Catch all route - redirect to login if not authenticated, dashboard if authenticated */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Main App Component with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;


