import React from "react";

const BannerWithAbout = () => {
  return (
    <section className="bg-black flex flex-col md:flex-row items-center px-6 py-16 max-w-7xl mx-auto gap-10">
      {/* Banner Image */}
      <div
        className="w-full md:w-1/2 h-64 sm:h-80 md:h-[460px] rounded-xl shadow-lg bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
        }}
        aria-label="Banner Image"
      ></div>

      {/* About Text */}
      <div className="w-full md:w-1/2 text-white max-w-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 tracking-tight">
          Welcome to Our Platform
        </h1>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
          Discover amazing products and connect with trusted sponsors to grow your business.  
          Join us and experience a world of opportunities made just for you.
        </p>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-full transition duration-300">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default BannerWithAbout;



