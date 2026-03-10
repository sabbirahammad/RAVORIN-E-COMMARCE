import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Truck, BadgePercent, ThumbsUp } from "lucide-react";

const features = [
  {
    title: "Exclusive Designs",
    desc: "Curated styles that perfectly match your vibe and uniqueness.",
    icon: <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />,
  },
  {
    title: "Secure Checkout",
    desc: "We ensure complete safety with advanced data encryption.",
    icon: <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10" />,
  },
  {
    title: "Fast Delivery",
    desc: "Get your favorite items delivered swiftly to your doorstep.",
    icon: <Truck className="w-8 h-8 sm:w-10 sm:h-10" />,
  },
  {
    title: "Member Discounts",
    desc: "Join our loyalty program to unlock exclusive savings.",
    icon: <BadgePercent className="w-8 h-8 sm:w-10 sm:h-10" />,
  },
  {
    title: "Loved by All",
    desc: "Our community's love and trust drive us to grow.",
    icon: <ThumbsUp className="w-8 h-8 sm:w-10 sm:h-10" />,
  },
];

const AdFeatureSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center mb-12"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
          <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Why Shop With Us?
          </span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-300">
          Experience premium quality, fast service, and exclusive offers built just for you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            viewport={{ once: true }}
            className="group transition-all duration-300 rounded-2xl shadow-lg hover:shadow-2xl p-5 text-center transform hover:-translate-y-2 hover:scale-105 bg-gray-800/80 hover:bg-gray-700/90 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600"
          >
            <div className="flex justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:text-yellow-400">
              {React.cloneElement(feature.icon, {
                className: "w-8 h-8 sm:w-10 sm:h-10 text-gray-300 group-hover:text-yellow-400 transition-all duration-300"
              })}
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-white group-hover:text-yellow-300 transition-all duration-300">{feature.title}</h3>
            <p className="text-sm sm:text-base text-gray-300 group-hover:text-gray-200 transition-all duration-300">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AdFeatureSection;

