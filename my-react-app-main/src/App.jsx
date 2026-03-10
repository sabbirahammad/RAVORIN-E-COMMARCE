import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Product from './Pages/Product';
import ProductDetailPage from './Componend/ProductDetails/ProductDetailPage';
import ScrollToTop from './Pages/ScrollToTop';
import DashboardPage from './Componend/ManageAccount/DashboardPage'; // ✅ This imports the page with Sidebar
import BrandPage from './Componend/CatagoryProduct/BrandPage';
import AboutPageinfo from './Componend/about/AboutPage';
import HelpCenterPage from './Pages/HelpCenterPage';
import AuthPage from './Pages/AuthPage';
import ErrorBoundary from './Pages/ErrorBoundary';
import MainCartPage from './Componend/Cart/MainCartPage'; // Import the main cart page
import Cartpaymnent from './Pages/Cartpayment'; // Import the cart payment page
import CheckoutPage from './Componend/Cart/CheckoutPage';
import CheckoutDetailsPage from './Componend/Cart/CheckoutDetailsPage';
import CheckoutDetails from './Pages/CheckoutDetails';
import PaymentOption from './Componend/ManageAccount/PaymentOption';
import UserMenu from './Componend/NavberSection/UserMenu';
import GoogleSuccess from './Componend/googlesign/GoogleSuccess';
import GoogleCallbackPage from './Componend/googlesign/GoogleCallbackPage';

const App = () => {
  return (
    <ErrorBoundary> {/* Wrap the entire Router with ErrorBoundary */}
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/productdetails" element={<ProductDetailPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Dashboard routes (with sidebar) */}
          <Route path="/*" element={<DashboardPage />} />
          <Route path='/category' element={<BrandPage />} />
          <Route path='/about' element={<AboutPageinfo />} />
          <Route path="/category/:slug" element={<BrandPage />} />
          {/* <Route path='/products/:slug' element={<Product />} /> */}
          <Route path="/help-center" element={<HelpCenterPage />} />
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/cart' element={<MainCartPage/>}/>
          <Route path='/cart/:id' element={<MainCartPage/>}/>
          <Route path='/cartpayment' element={<Cartpaymnent/>}/>
          <Route path='/checkout-details' element={<CheckoutDetails/>}/>
          <Route path='/mangaeaccount' element={<DashboardPage />} />
          <Route path='/checkout' element={<CheckoutPage/>}/>
          <Route path='/payment' element ={<PaymentOption/>}/>
          {/* <Route path='/auth' element={<UserMenu/>}/> */}
          <Route path='/auth/success' element={<GoogleSuccess/>}/>
          <Route path='/auth/google/callback' element={<GoogleCallbackPage/>}/>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
