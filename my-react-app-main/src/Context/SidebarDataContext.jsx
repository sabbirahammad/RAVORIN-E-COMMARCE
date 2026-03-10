// SidebarDataContext.jsx
import { createContext, useContext } from 'react';

const SidebarDataContext = createContext();

const categories = [
  { name: 'Refrigerators' },
  { name: 'Smart Televisions' },
  { name: 'Freezers' },
  { name: 'LED Televisions' },
  { name: 'Air Conditioners' },
  { name: 'Washing Machines' },
  { name: 'QLED Televisions' },
  { name: 'Hand Washes and Sanitizers' },
];

const brands = [
  'Minister', 'Haier', 'Jamuna', 'Hisense', 'Whirlpool', 'MYONE',
  'Vikan', 'Walton', 'VISION', 'Samsung', 'Sony Plus', 'Perfect',
  'Smart', 'Samsung'
];

const services = [
  'Free Home Delivery',
  'Cash on Delivery Available',
  'Official Brand Warranty',
  '7 Days Easy Return',
  '24/7 Customer Support',
  'Secure Online Payment',
  'Same Day Shipping',
  'Authentic Products Guaranteed'
];

const shoppingFrom = [
  'Official Stores',
  'Local Sellers',
  'International Sellers',
  'Daraz Mall',
  'Flash Sale',
  'Top Rated Sellers',
  'Global Collection',
  'Verified Sellers'
];

const colorFamily = [
  'Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink',
  'Purple', 'Grey', 'Orange', 'Brown', 'Maroon'
];

export const SidebarDataProvider = ({ children }) => {
  return (
    <SidebarDataContext.Provider
      value={{ categories, brands, services, shoppingFrom, colorFamily }}
    >
      {children}
    </SidebarDataContext.Provider>
  );
};

export const useSidebarData = () => useContext(SidebarDataContext);

