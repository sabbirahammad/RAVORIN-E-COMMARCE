import React, { useEffect } from 'react';
import { useProduct } from '../../Context/UseContext';
import Navbar from '../Homepage/Navbar';
import HeroSection from '../Homepage/herosection';
import Catagoryproduct from '../Homepage/Catagoryproduct';
import Products from '../Homepage/Products';
import Footer from '../Homepage/Footer';

const HomePage = () => {
  const { setSelectedCategory } = useProduct();

  useEffect(() => {
    setSelectedCategory(null);
  }, [setSelectedCategory]);

  return (
    <div className="font-sans w-full overflow-x-hidden bg-[#f6f7fb] text-[#1d2141]">
      <Navbar />
      <HeroSection />
      <Catagoryproduct />
      <Products />
      <Footer />
    </div>
  );
};

export default HomePage;
