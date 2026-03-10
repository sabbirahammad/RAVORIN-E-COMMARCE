import React from 'react';
import Topbar from '../Componend/Products/Topbar';
import Navbar from '../Componend/Products/Navbar';
import CheckoutDetailsPage from '../Componend/Cart/CheckoutDetailsPage';

const CheckoutDetails = () => {
  return (
    <div>
      <Topbar />
      <Navbar />
      <CheckoutDetailsPage />
    </div>
  );
};

export default CheckoutDetails;
