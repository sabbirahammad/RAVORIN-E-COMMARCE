import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Share2, ArrowUp } from 'lucide-react';
import Navbar from '../Componend/Products/Navbar';

const sections = {
  'sample-center': {
    title: 'Sample Center',
    description: 'Browse and request product samples from trusted suppliers. Find top-rated samples curated for your business needs.',
    faqs: [
      { q: 'How do I request a sample?', a: 'Select your desired product and click "Request Sample" to connect with the supplier.' },
      { q: 'Are samples free?', a: 'Sample costs vary by supplier. Check the product listing for details.' },
    ],
  },
  'online-trade-show': {
    title: 'Online Trade Show',
    description: 'Attend live virtual trade shows from your device. Discover trending products and connect with verified suppliers.',
    faqs: [
      { q: 'How do I join a trade show?', a: 'Register for events through the platform and join via the provided link.' },
      { q: 'Are trade shows recorded?', a: 'Some events offer recordings, check the event details for availability.' },
    ],
  },
  tips: {
    title: 'Tips',
    description: 'Explore expert guides and best practices to improve your sourcing, selling, and growing strategies.',
    faqs: [
      { q: 'How often are tips updated?', a: 'New tips are added weekly by industry experts.' },
      { q: 'Can I submit my own tips?', a: 'Yes, contact our team to contribute your expertise.' },
    ],
  },
  live: {
    title: 'LIVE',
    description: 'Watch live product demos, factory tours, and real-time Q&A with sellers to make informed decisions.',
    faqs: [
      { q: 'How do I join a live session?', a: 'Click the "Join Live" button on the event page to participate.' },
      { q: 'Can I ask questions during live sessions?', a: 'Yes, use the Q&A feature during the session.' },
    ],
  },
};

const HelpCenterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const selected = searchParams.get('section') || 'sample-center';
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleTabClick = (key) => {
    navigate(`/help-center?section=${key}`);
    setExpandedFAQ(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredSections = Object.entries(sections).filter(([key, value]) =>
    value.title.toLowerCase().includes(searchQuery) || value.description.toLowerCase().includes(searchQuery)
  );

  const handleShare = (title) => {
    if (navigator.share) {
      navigator.share({
        title: `Help Center: ${title}`,
        url: window.location.href,
      });
    }
  };

  const handleScroll = () => {
    setShowBackToTop(window.scrollY > 300);
  };

  React.useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section>
        <Navbar/>
        <div className="min-h-screen bg-neutral-50 px-4 sm:px-6 lg:px-8 py-12" style={{ color: '#374151' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search help topics..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-4 pr-12 rounded-lg bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2" style={{ color: '#6B7280' }} size={20} />
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4">{sections[selected].title}</h1>
          <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto" style={{ color: '#6B7280' }}>{sections[selected].description}</p>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {filteredSections.map(([key, value]) => (
            <motion.button
              key={key}
              onClick={() => handleTabClick(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-lg p-4 transition duration-200 text-sm sm:text-base font-semibold focus:outline-none shadow-md ${
                selected === key
                  ? 'bg-blue-600'
                  : 'bg-neutral-200 hover:bg-neutral-300'
              }`}
            >
              {value.title}
            </motion.button>
          ))}
        </div>

        {/* Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-neutral-50 p-6 sm:p-8 rounded-xl shadow-lg" style={{ backgroundColor: '#F9F9F9' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">{sections[selected].title}</h2>
              <button
                onClick={() => handleShare(sections[selected].title)}
                className="flex items-center gap-2 transition" style={{ color: '#6B7280' }}
              >
                <Share2 size={20} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
            <p className="leading-relaxed mb-6" style={{ color: '#6B7280' }}>{sections[selected].description}</p>

            {/* FAQ Section */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Frequently Asked Questions</h3>
              {sections[selected].faqs.map((faq, index) => (
                <div key={index} className="border-b" style={{ borderColor: '#E5E7EB' }}>
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full flex justify-between items-center py-4 text-left"
                  >
                    <span className="font-medium" style={{ color: '#374151' }}>{faq.q}</span>
                    <ChevronDown
                      className={`transition-transform duration-200 ${expandedFAQ === index ? 'rotate-180' : ''}`}
                      size={20}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pb-4" style={{ color: '#6B7280' }}
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Back to Top Button */}
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 right-6 bg-cyan-600 text-white p-3 rounded-full shadow-lg hover:bg-cyan-700 transition"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </motion.div>
    </div>
    </section>
  );
};

export default HelpCenterPage;


