// import { createContext, useContext, useState, useEffect } from 'react';
// import imaze1 from '../imaze/i.jpg';
// import imaze2 from '../imaze/i2.jpg';
// import imaze3 from '../Photo/i3.jpg';
// import imaze4 from '../Photo/i4.jpg';

// const ProductContext = createContext();

// // Categories
// const categories = [
//   { name: 'Men' },
//   { name: 'Women' },
//   { name: 'Custom Print' },
//   { name: 'Premium' },
// ];

// // Trending IDs (manual)
// const trendingIds = [1, 3, 7, 12, 25, 30, 45, 60];

// // ✅ Image sets
// const menImages = [
//   imaze1,
//   imaze3,
  
// ];

// const womenImages = [
//   imaze2,
//   imaze4,
// ];

// const customPrintImages = [
//   'https://images.unsplash.com/photo-1617957741975-ef0b6ed6e04b?auto=format&fit=crop&w=600&q=80',
//   'https://images.unsplash.com/photo-1581091215367-59a5c9dfba78?auto=format&fit=crop&w=600&q=80',
//   'https://images.unsplash.com/photo-1616401782217-f1d7e4fcd9f6?auto=format&fit=crop&w=600&q=80',
// ];

// const premiumImages = [
//   'https://images.unsplash.com/photo-1618354691315-01565b5800b5?auto=format&fit=crop&w=600&q=80',
//   'https://images.unsplash.com/photo-1576871337632-f8aa01f0adb4?auto=format&fit=crop&w=600&q=80',
//   'https://images.unsplash.com/photo-1600185365005-c48a674ba001?auto=format&fit=crop&w=600&q=80',
// ];

// // ✅ Build products in blocks of category
// const products = [];

// const categoriesList = [
//   { name: 'Men', images: menImages },
//   { name: 'Women', images: womenImages },
//   { name: 'Custom Print', images: customPrintImages },
//   { name: 'Premium', images: premiumImages },
// ];

// categoriesList.forEach((cat, catIndex) => {
//   for (let i = 0; i < 25; i++) {
//     const id = catIndex * 25 + i + 1;
//     const image = cat.images[i % cat.images.length];

//     products.push({
//       id,
//       name: `${cat.name} Product ${i + 1}`,
//       price: 500 + i * 10,
//       oldPrice: 600 + i * 10,
//       category: cat.name,
//       image,
//       description: `This is a ${cat.name} product.`,
//       sold: Math.floor(Math.random() * 100),
//       isTrending: trendingIds.includes(id),
//     });
//   }
// });

// // ✅ Category banner images
// const categoryBanners = {
//   Men: imaze1,
//   Women: imaze2,
//   'Custom Print': imaze3,
//   Premium: imaze4,
// };

// export const ProductProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState(() => {
//     const stored = localStorage.getItem('cartItems');
//     return stored ? JSON.parse(stored) : [];
//   });

//   const [recentlyViewed, setRecentlyViewed] = useState(() => {
//     const stored = localStorage.getItem('recentlyViewed');
//     return stored ? JSON.parse(stored) : [];
//   });

//   const [sortOption, setSortOption] = useState('popularity');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedBrand, setSelectedBrand] = useState([]);
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [selectedShoppingFrom, setSelectedShoppingFrom] = useState([]);
//   const [selectedColorFamily, setSelectedColorFamily] = useState([]);

//   useEffect(() => {
//     localStorage.setItem('cartItems', JSON.stringify(cartItems));
//   }, [cartItems]);

//   useEffect(() => {
//     localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
//   }, [recentlyViewed]);

//   const addToCart = (newItem) => {
//     setCartItems((prev) => {
//       const existingItem = prev.find(
//         (item) => item.id === newItem.id && item.selectedSize === newItem.selectedSize
//       );
//       if (existingItem) {
//         return prev.map((item) =>
//           item.id === newItem.id && item.selectedSize === newItem.selectedSize
//             ? { ...item, qty: item.qty + newItem.qty }
//             : item
//         );
//       } else {
//         return [...prev, newItem];
//       }
//     });
//   };

//   const addToRecentlyViewed = (product) => {
//     setRecentlyViewed((prev) => {
//       const exists = prev.find((item) => item.id === product.id);
//       if (exists) return prev;
//       return [product, ...prev].slice(0, 10);
//     });
//   };

//   const bannerImage = selectedCategory
//     ? categoryBanners[selectedCategory] || imaze1
//     : imaze1;

//   return (
//     <ProductContext.Provider
//       value={{
//         categories,
//         products,
//         bannerImage,
//         categoryBanners,
//         cartItems,
//         setCartItems,
//         addToCart,
//         recentlyViewed,
//         addToRecentlyViewed,
//         selectedCategory,
//         setSelectedCategory,
//         selectedBrand,
//         setSelectedBrand,
//         selectedServices,
//         setSelectedServices,
//         selectedShoppingFrom,
//         setSelectedShoppingFrom,
//         selectedColorFamily,
//         setSelectedColorFamily,
//         sortOption,
//         setSortOption,
//       }}
//     >
//       {children}
//     </ProductContext.Provider>
//   );
// };

// export const useProduct = () => useContext(ProductContext);




import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './GoogleAuth';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [allcategories, setAllcategories] = useState([]);
  const [categoryBanners, setCategoryBanners] = useState({});
  const [loading, setLoading] = useState(true);
  const hasFetchedDataRef = useRef(false);

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const stored = localStorage.getItem('recentlyViewed');
    return stored ? JSON.parse(stored) : [];
  });

  const [sortOption, setSortOption] = useState('popularity');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedShoppingFrom, setSelectedShoppingFrom] = useState([]);
  const [selectedColorFamily, setSelectedColorFamily] = useState([]);

  const API_BASE_URL = 'https://apii.ravorin.com/api/v1';

  useEffect(() => {
    // Only fetch data once on mount, prevent repeated API calls
    if (!hasFetchedDataRef.current) {
      fetchAllData();
    }
  }, []);

  // Fetch cart items when user authentication state changes (with throttling)
  useEffect(() => {
    if (isAuthenticated && user && token) {
      // Add a small delay to prevent rapid successive calls
      const timeoutId = setTimeout(() => {
        fetchCartItems();
      }, 100);
      return () => clearTimeout(timeoutId);
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated, user, token]);

  const fetchCartItems = async () => {
    if (!isAuthenticated || !token) {
      setCartItems([]);
      return;
    }

    try {
      setCartLoading(true);
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.success && response.data?.cart) {
        // Map backend cart items to expected frontend format
        const mappedItems = (response.data.cart.items || []).map(item => ({
          id: item._id, // Cart item ID for API operations
          _id: item._id, // Keep original _id for reference
          product_id: item.product_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '/no-image.svg',
          size: item.size || 'M' // Include size information
        }));
        setCartItems(mappedItems);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error fetching cart items:', err);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

const fetchAllData = useCallback(async () => {
  // Prevent multiple simultaneous API calls
  if (hasFetchedDataRef.current) {
    console.log("📋 Data already fetched, skipping API calls");
    return;
  }

  try {
    console.log("🔄 Starting API calls...");
    hasFetchedDataRef.current = true;

    setLoading(true);

    // Fetch products and categories simultaneously to reduce loading time
    const [productsRes, categoriesRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/products`),
      axios.get(`${API_BASE_URL}/categories`)
    ]);

    // ✅ Handle Products
    if (productsRes.data?.success && Array.isArray(productsRes.data.products)) {
      setProducts(productsRes.data.products);
    } else {
      console.warn("⚠️ Products data is not an array:", productsRes.data);
      setProducts([]);
    }

    // ✅ Handle Categories
    if (Array.isArray(categoriesRes.data)) {
      setCategories(categoriesRes.data);
      setAllcategories(categoriesRes.data);
    } else {
      console.warn("⚠️ Categories data is not an array:", categoriesRes.data);
      setCategories([]);
      setAllcategories([]);
    }

  } catch (error) {
    console.error('❌ Failed to fetch all data:', error);
    console.error('❌ Error details:', error.response?.data || error.message);
    setProducts([]);
    setCategories([]);
    setAllcategories([]);
    // Reset the ref on error to allow retry
    hasFetchedDataRef.current = false;
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToCart = async (productData) => {
    if (!isAuthenticated || !token || !user) {
      console.error('User must be authenticated to add items to cart');
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      setCartLoading(true);

      // For now, let's try to use the product ID as-is and see if it works
      // If the frontend products have the correct MongoDB ObjectIds, this should work
      const productId = productData._id || productData.id;

      if (!productId) {
        return { success: false, message: 'Product ID not found' };
      }

      // Prepare the data for the API call
      const cartData = {
        product_id: productId,
        quantity: productData.qty || productData.quantity || 1,
        size: productData.selectedSize || productData.size || 'M'
      };

      console.log('Adding to cart:', cartData);
      console.log('Product data received:', {
        selectedSize: productData.selectedSize,
        size: productData.size,
        qty: productData.qty,
        quantity: productData.quantity
      });

      const response = await axios.post(`${API_BASE_URL}/cart/items`, cartData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.success) {
        // Refresh cart items after successful addition
        await fetchCartItems();
        return { success: true, message: 'Item added to cart successfully' };
      } else {
        return { success: false, message: response.data?.message || 'Failed to add item to cart' };
      }
    } catch (err) {
      console.error('Error adding item to cart:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Failed to add item to cart';
      return { success: false, message: errorMessage };
    } finally {
      setCartLoading(false);
    }
  };

  const addToRecentlyViewed = (product) => {
    setRecentlyViewed((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [product, ...prev].slice(0, 10);
    });
  };

  const bannerImage = selectedCategory
    ? `/images/${selectedCategory.toLowerCase()}.jpg`
    : '/images/i.jpg';

  // ✅ এখন এটা কাজ করবে — products array হবে

console.log(products)
  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        subcategories,
        allcategories,
        categoryBanners,
        bannerImage,
        cartItems,
        setCartItems,
        addToCart,
        fetchCartItems,
        cartLoading,
        recentlyViewed,
        addToRecentlyViewed,
        selectedCategory,
        setSelectedCategory,
        selectedBrand,
        setSelectedBrand,
        selectedServices,
        setSelectedServices,
        selectedShoppingFrom,
        setSelectedShoppingFrom,
        selectedColorFamily,
        setSelectedColorFamily,
        sortOption,
        setSortOption,
        loading,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);




// src/Context/UseContext.js

// import { createContext, useContext, useState, useEffect } from 'react';

// const ProductContext = createContext();

// export const ProductProvider = ({ children }) => {
//   const [products, setProducts] = useState([
//    {
//       "id": "722c",
//       "name": "shart",
//       "price": "666",
//       "category": "men",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749878843/wubl2quz3qagskk2nqzk.jpg"
//       ],
//       "isTrending": false,
//       "isTopProduct": false,
//       "description": "asfhiwqerf0qowfrw"
//     },
//     {
//       "id": "c3b0",
//       "name": "shart",
//       "price": "000",
//       "category": "women",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749878997/dhseufq77rmiiyj7jicd.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749879005/uk5qxn0aespcsc4yvehg.jpg",
//         "",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749879019/owahoqvgclvngw4erupk.jpg"
//       ],
//       "isTrending": false,
//       "isTopProduct": false,
//       "description": "fdsafdsasfed"
//     },
//     {
//       "id": "6f32",
//       "name": "new",
//       "price": "681",
//       "category": "Women",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749879525/ly4xamqhz76etveohsiz.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "hi,hello"
//     },
//     {
//       "id": "d648",
//       "name": "borka",
//       "price": "123",
//       "category": "man",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749881045/sixkbpfvnacqdqp4grou.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749881051/ddgrvghqwegzgsmkvirg.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749881055/w0j1q7uobirenkucfytn.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": true,
//       "description": "hi,my name is sabbir"
//     },
//     {
//       "id": "3137",
//       "name": "t",
//       "price": "444",
//       "category": "Male",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883828/xempay6vgz8te0qvc69k.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883831/io4kshipmpr9gxaiwkt5.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883837/irc0mrjwgwccrvwh2pxr.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "dasdfasdd"
//     },
//     {
//       "id": "3137",
//       "name": "t",
//       "price": "444",
//       "category": "t-shirts",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883828/xempay6vgz8te0qvc69k.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883831/io4kshipmpr9gxaiwkt5.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883837/irc0mrjwgwccrvwh2pxr.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "dasdfasdd"
//     },
//     {
//       "id": "3137",
//       "name": "t",
//       "price": "444",
//       "category": "Male",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883828/xempay6vgz8te0qvc69k.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883831/io4kshipmpr9gxaiwkt5.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883837/irc0mrjwgwccrvwh2pxr.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "dasdfasdd"
//     },
//     {
//       "id": "3137",
//       "name": "t",
//       "price": "444",
//       "category": "Male",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883828/xempay6vgz8te0qvc69k.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883831/io4kshipmpr9gxaiwkt5.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883837/irc0mrjwgwccrvwh2pxr.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "dasdfasdd"
//     },
//     {
//       "id": "3137",
//       "name": "t",
//       "price": "444",
//       "category": "Male",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883828/xempay6vgz8te0qvc69k.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883831/io4kshipmpr9gxaiwkt5.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883837/irc0mrjwgwccrvwh2pxr.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "dasdfasdd"
//     },
//     {
//       "id": "3137",
//       "name": "t",
//       "price": "444",
//       "category": "Male",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883828/xempay6vgz8te0qvc69k.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883831/io4kshipmpr9gxaiwkt5.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883837/irc0mrjwgwccrvwh2pxr.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "dasdfasdd"
//     },
//     {
//       "id": "3137",
//       "name": "t",
//       "price": "444",
//       "category": "Male",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883828/xempay6vgz8te0qvc69k.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883831/io4kshipmpr9gxaiwkt5.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883837/irc0mrjwgwccrvwh2pxr.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "dasdfasdd"
//     },
//     {
//       "id": "3137",
//       "name": "t",
//       "price": "444",
//       "category": "Male",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883828/xempay6vgz8te0qvc69k.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883831/io4kshipmpr9gxaiwkt5.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883837/irc0mrjwgwccrvwh2pxr.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "dasdfasdd"
//     },
//     {
//       "id": "3137",
//       "name": "t",
//       "price": "444",
//       "category": "Male",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883828/xempay6vgz8te0qvc69k.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883831/io4kshipmpr9gxaiwkt5.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883837/irc0mrjwgwccrvwh2pxr.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "dasdfasdd"
//     },
//     {
//       "id": "3137",
//       "name": "t",
//       "price": "444",
//       "category": "Male",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883828/xempay6vgz8te0qvc69k.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883831/io4kshipmpr9gxaiwkt5.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883837/irc0mrjwgwccrvwh2pxr.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "dasdfasdd"
//     },
//     {
//       "id": "3137",
//       "name": "t",
//       "price": "444",
//       "category": "Male",
//       "images": [
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883828/xempay6vgz8te0qvc69k.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883831/io4kshipmpr9gxaiwkt5.jpg",
//         "https://res.cloudinary.com/dpgags9kx/image/upload/v1749883837/irc0mrjwgwccrvwh2pxr.jpg"
//       ],
//       "isTrending": true,
//       "isTopProduct": false,
//       "description": "dasdfasdd"
//     }
//     // আরও প্রোডাক্ট চাইলে এখানে যোগ করো
//   ]);

//   const [categories, setCategories] = useState(['women', 'men', 'kids']);
//   const [loading, setLoading] = useState(true);

//   const [cartItems, setCartItems] = useState(() => {
//     const stored = localStorage.getItem('cartItems');
//     return stored ? JSON.parse(stored) : [];
//   });

//   const [recentlyViewed, setRecentlyViewed] = useState(() => {
//     const stored = localStorage.getItem('recentlyViewed');
//     return stored ? JSON.parse(stored) : [];
//   });

//   const [sortOption, setSortOption] = useState('popularity');
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedBrand, setSelectedBrand] = useState([]);
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [selectedShoppingFrom, setSelectedShoppingFrom] = useState([]);
//   const [selectedColorFamily, setSelectedColorFamily] = useState([]);

//   useEffect(() => {
//     // Simulate loading delay
//     const timeout = setTimeout(() => setLoading(false), 1000);
//     return () => clearTimeout(timeout);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('cartItems', JSON.stringify(cartItems));
//   }, [cartItems]);

//   useEffect(() => {
//     localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
//   }, [recentlyViewed]);

//   const addToCart = (newItem) => {
//     setCartItems((prev) => {
//       const existingItem = prev.find(
//         (item) => item.id === newItem.id && item.selectedSize === newItem.selectedSize
//       );
//       if (existingItem) {
//         return prev.map((item) =>
//           item.id === newItem.id && item.selectedSize === newItem.selectedSize
//             ? { ...item, qty: item.qty + newItem.qty }
//             : item
//         );
//       } else {
//         return [...prev, newItem];
//       }
//     });
//   };



  

//   const addToRecentlyViewed = (product) => {
//     setRecentlyViewed((prev) => {
//       const exists = prev.find((item) => item.id === product.id);
//       if (exists) return prev;
//       return [product, ...prev].slice(0, 10);
//     });
//   };

//   const bannerImage = selectedCategory
//     ? `/images/${selectedCategory.toLowerCase()}.jpg`
//     : '/images/i.jpg';

//   return (
//     <ProductContext.Provider
//       value={{
//         categories,
//         products,
//         bannerImage,
//         cartItems,
//         setCartItems,
//         addToCart,
//         recentlyViewed,
//         addToRecentlyViewed,
//         selectedCategory,
//         setSelectedCategory,
//         selectedBrand,
//         setSelectedBrand,
//         selectedServices,
//         setSelectedServices,
//         selectedShoppingFrom,
//         setSelectedShoppingFrom,
//         selectedColorFamily,
//         setSelectedColorFamily,
//         sortOption,
//         setSortOption,
//         loading,
//       }}
//     >
//       {children}
//     </ProductContext.Provider>
//   );
// };

// export const useProduct = () => useContext(ProductContext);
