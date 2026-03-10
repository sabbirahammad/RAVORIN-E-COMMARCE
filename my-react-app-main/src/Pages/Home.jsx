import React from 'react';
import Navbar from '../Componend/Homepage/Navbar';
import HeroSection from '../Componend/Homepage/herosection';
import Catagoryproduct from '../Componend/Homepage/Catagoryproduct';
import Products from '../Componend/Homepage/Products';
import Footer from '../Componend/Homepage/Footer';

const Home = () => {
  return (
    <div className="font-sans w-full overflow-x-hidden bg-[#121212] text-white">
      <Navbar />
      <HeroSection />
      <Catagoryproduct />
      <Products />
      <Footer />
    </div>
  );
};

export default Home;
