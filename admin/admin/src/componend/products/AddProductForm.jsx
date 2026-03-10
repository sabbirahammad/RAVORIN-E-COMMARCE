// import { useState } from 'react';

// const AddProductForm = () => {
//   const [product, setProduct] = useState({
//     name: '',
//     sku: '',
//     price: '',
//     stock: '',
//     category_id: '',       
//     sub_category_id: '',   
//     sub_sub_category_id: '', 
//     images: [], // URL গুলো রাখবে
//     description: '',
//   });

//   const [previews, setPreviews] = useState([null, null, null]);
//   const [uploading, setUploading] = useState([false, false, false]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProduct((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Auto upload when image is selected
//   const handleFileSelect = async (file, index) => {
//     if (!file) return;

//     // Show preview immediately
//     setPreviews((prev) => {
//       const updated = [...prev];
//       updated[index] = URL.createObjectURL(file);
//       return updated;
//     });

//     // Start uploading
//     setUploading((prev) => {
//       const updated = [...prev];
//       updated[index] = true;
//       return updated;
//     });

//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       const response = await fetch(
//         "https://ecommerce-production-16c4.up.railway.app/api/v1/upload",
//         {
//           method: 'POST',
//           body: formData,
//         }
//       );

//       const responseData = await response.json();

//       // Upload successful - store the URL
//       if (response.ok && responseData && responseData.url) {
//         setProduct((prev) => {
//           const updated = [...prev.images];
          
//           while (updated.length <= index) {
//             updated.push(null);
//           }
          
//           updated[index] = responseData.url;
          
//           return { ...prev, images: updated };
//         });
//       } else {
//         alert('Upload failed: No URL received');
//         setPreviews((prev) => {
//           const updated = [...prev];
//           updated[index] = null;
//           return updated;
//         });
//       }

//     } catch (error) {
//       console.error('Upload error:', error);
//       alert('Upload failed: ' + error.message);
      
//       setPreviews((prev) => {
//         const updated = [...prev];
//         updated[index] = null;
//         return updated;
//       });
//     } finally {
//       setUploading((prev) => {
//         const updated = [...prev];
//         updated[index] = false;
//         return updated;
//       });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const price = parseFloat(product.price);
//     const stock = parseInt(product.stock, 10);
    
//     const category_id = product.category_id ? parseInt(product.category_id, 10) : undefined;
//     const sub_category_id = product.sub_category_id ? parseInt(product.sub_category_id, 10) : undefined;
//     const sub_sub_category_id = product.sub_sub_category_id ? parseInt(product.sub_sub_category_id, 10) : undefined;

//     if (isNaN(price) || price < 0) {
//       alert('Please enter valid price (must be >= 0)');
//       return;
//     }

//     if (isNaN(stock) || stock < 0) {
//       alert('Please enter valid stock (must be >= 0)');
//       return;
//     }

//     if (uploading.some(status => status)) {
//       alert('Please wait for image uploads to complete');
//       return;
//     }

//     const validImages = product.images.filter(img => img && typeof img === 'string' && img.trim() !== '');
//     if (validImages.length === 0) {
//       alert('Please select at least 1 product image');
//       return;
//     }

//     const productData = {
//       name: product.name,
//       sku: product.sku,
//       price,
//       stock,
//       images: validImages,
//       description: product.description,
//     };

//     if (category_id !== undefined && category_id > 0) {
//       productData.category_id = category_id;
//     }
//     if (sub_category_id !== undefined && sub_category_id > 0) {
//       productData.sub_category_id = sub_category_id;
//     }
//     if (sub_sub_category_id !== undefined && sub_sub_category_id > 0) {
//       productData.sub_sub_category_id = sub_sub_category_id;
//     }

//     console.log('Sending product data:', productData);

//     try {
//       const response = await fetch(
//         'https://ecommerce-production-16c4.up.railway.app/api/v1/products',
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(productData),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         alert('Product added successfully!');
//         setProduct({
//           name: '',
//           sku: '',
//           price: '',
//           stock: '',
//           category_id: '',
//           sub_category_id: '',
//           sub_sub_category_id: '',
//           images: [],
//           description: '',
//         });
//         setPreviews([null, null, null]);
//         setUploading([false, false, false]);
//       } else {
//         alert(data.message || 'Failed to add product');
//       }
//     } catch (err) {
//       console.error('Failed to submit:', err);
//       alert('Failed to add product: ' + err.message);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto mt-8 p-4">
//       <div className="bg-white shadow-lg p-8 rounded-xl border border-gray-100">
//         <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Add New Product</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
//               <input 
//                 type="text" 
//                 name="name" 
//                 value={product.name} 
//                 onChange={handleChange} 
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
//                 required 
//                 placeholder="Enter product name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">SKU *</label>
//               <input 
//                 type="text" 
//                 name="sku" 
//                 value={product.sku} 
//                 onChange={handleChange} 
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
//                 required 
//                 placeholder="Enter SKU"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
//               <input 
//                 type="number" 
//                 step="0.01"
//                 name="price" 
//                 value={product.price} 
//                 onChange={handleChange} 
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
//                 required 
//                 placeholder="0.00"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Stock *</label>
//               <input 
//                 type="number" 
//                 name="stock" 
//                 value={product.stock} 
//                 onChange={handleChange} 
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
//                 required 
//                 placeholder="0"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Category ID</label>
//               <input 
//                 type="number" 
//                 name="category_id" 
//                 value={product.category_id} 
//                 onChange={handleChange} 
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
//                 placeholder="Optional"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-2">Sub Category ID</label>
//               <input 
//                 type="number" 
//                 name="sub_category_id" 
//                 value={product.sub_category_id} 
//                 onChange={handleChange} 
//                 className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
//                 placeholder="Optional"
//               />
//             </div>
//           </div>

//           {/* <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Sub-Sub Category ID</label>
//             <input 
//               type="number" 
//               name="sub_sub_category_id" 
//               value={product.sub_sub_category_id} 
//               onChange={handleChange} 
//               className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
//               placeholder="Optional"
//             />
//           </div> */}

//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
//             <textarea 
//               name="description" 
//               value={product.description} 
//               onChange={handleChange} 
//               className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
//               rows="4"
//               placeholder="Enter product description..."
//             />
//           </div>

//           <div className="bg-gray-50 p-6 rounded-lg">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Images *</h3>
//             <p className="text-sm text-gray-600 mb-4">Images will upload automatically when selected</p>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[...Array(3)].map((_, i) => (
//                 <div key={i} className="space-y-3">
//                   <label className="block text-sm font-medium text-gray-700">
//                     Image {i + 1} {i === 0 && <span className="text-red-500">(Required)</span>}
//                   </label>
                  
//                   <div className="relative">
//                     <input 
//                       type="file" 
//                       accept="image/*" 
//                       onChange={(e) => handleFileSelect(e.target.files[0], i)} 
//                       disabled={uploading[i]}
//                       className="w-full border-2 border-dashed border-gray-300 px-4 py-3 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
//                     />
                    
//                     {uploading[i] && (
//                       <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
//                         <div className="flex items-center text-blue-600">
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
//                           <span className="text-sm font-medium">Uploading...</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>
                  
//                   {previews[i] && !uploading[i] && (
//                     <div className="space-y-2">
//                       <img 
//                         src={previews[i]} 
//                         alt={`Preview ${i + 1}`} 
//                         className="w-full h-40 object-cover border-2 border-gray-200 rounded-lg shadow-sm" 
//                       />
//                       <div className="text-xs space-y-1">
//                         <p className={`font-medium ${product.images[i] ? 'text-green-600' : 'text-red-500'}`}>
//                           {product.images[i] ? '✓ Upload Success' : '✗ Upload Failed'}
//                         </p>
//                         {product.images[i] && (
//                           <p className="text-gray-500 truncate" title={product.images[i]}>
//                             URL: {product.images[i]}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="pt-6 border-t border-gray-200">
//             <button 
//               type="submit"
//               disabled={uploading.some(status => status)}
//               className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold px-6 py-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
//             >
//               {uploading.some(status => status) ? (
//                 <span className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
//                   Uploading Images...
//                 </span>
//               ) : (
//                 'Add Product'
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Debug Info */}
//         <div className="mt-8 p-4 bg-gray-100 rounded-lg">
//           <details className="cursor-pointer">
//             <summary className="font-medium text-gray-700 hover:text-gray-900">Debug Information</summary>
//             <div className="mt-3 space-y-2 text-xs">
//               <div>
//                 <strong className="text-gray-700">Uploaded Images:</strong>
//                 <pre className="mt-1 p-2 bg-white rounded text-gray-600 overflow-x-auto">
//                   {JSON.stringify(product.images.filter(img => img), null, 2) || '[]'}
//                 </pre>
//               </div>
//               <div>
//                 <strong className="text-gray-700">Upload Status:</strong>
//                 <p className="mt-1 text-gray-600">
//                   {uploading.map((status, i) => (
//                     <span key={i} className={`inline-block mr-3 px-2 py-1 rounded text-xs ${status ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
//                       Image {i+1}: {status ? 'Uploading' : 'Ready'}
//                     </span>
//                   ))}
//                 </p>
//               </div>
//             </div>
//           </details>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProductForm;


import { useState, useEffect } from "react";

const AddProductForm = () => {
  const initialState = {
    name: "",
    price: "",
    discount: "",
    category: "",
    images: ["", "", "", ""],
    isTrending: false,
    isTopProduct: false,
    description: "",
  };

  const [product, setProduct] = useState(initialState);
  const [previews, setPreviews] = useState(["", "", "", ""]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://apii.ravorin.com/api/v1/categories');
        const data = await response.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.categories) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setCategoryInput(value);
    setShowSuggestions(true);

    // If user clears the input, also clear the product category
    if (!value.trim()) {
      setProduct((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  const handleCategorySelect = (categoryName) => {
    setCategoryInput(categoryName);
    setProduct((prev) => ({
      ...prev,
      category: categoryName,
    }));
    setShowSuggestions(false);
  };

  const handleCategorySubmit = () => {
    const trimmedInput = categoryInput.trim();
    if (trimmedInput && trimmedInput !== product.category) {
      setProduct((prev) => ({
        ...prev,
        category: trimmedInput,
      }));
    }
    setShowSuggestions(false);
  };

  const filteredCategories = categories.filter(cat =>
    cat.title?.toLowerCase().includes(categoryInput.toLowerCase()) ||
    cat.name?.toLowerCase().includes(categoryInput.toLowerCase()) ||
    cat.items?.some(item => item.toLowerCase().includes(categoryInput.toLowerCase()))
  );

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCategorySubmit();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.category-input-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFileSelect = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setPreviews((prev) => {
      const updated = [...prev];
      updated[index] = previewUrl;
      return updated;
    });

    setProduct((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = file; // Store actual File object
      return { ...prev, images: updatedImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use categoryInput if it has a value, otherwise use product.category
    const finalCategory = categoryInput.trim() || product.category;
    if (!finalCategory) {
      alert("Please select or enter a category");
      return;
    }

    // Check if at least 1 image is selected
    const validImages = product.images.filter((img) => img instanceof File);
    if (validImages.length === 0) {
      alert("Please select at least 1 product image");
      return;
    }

    const discountValue = Number(product.discount || 0);
    if (Number.isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      alert("Discount must be between 0 and 100");
      return;
    }

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("discount", product.discount || 0);
    formData.append("category", finalCategory);
    formData.append("description", product.description);
    formData.append("isTrending", product.isTrending);
    formData.append("isTopProduct", product.isTopProduct);

    product.images.forEach((img) => {
      if (img instanceof File) formData.append("images", img);
    });

    try {
      const res = await fetch("https://apii.ravorin.com/api/v1/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Product added successfully!");
        setProduct(initialState);
        setPreviews(["", "", "", ""]);
        setCategoryInput("");
      } else {
        alert(data.message || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-8 p-3 sm:p-4">
      <div className="bg-white shadow-lg p-4 sm:p-6 lg:p-8 rounded-xl border border-gray-100">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8 text-center">
          Add New Product
        </h2>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {/* Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="text"
                name="price"
                value={product.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discount (%) 
              </label>
              <input
                type="number"
                name="discount"
                value={product.discount}
                min="0"
                max="100"
                onChange={handleChange}
                placeholder="Enter discount percent (0-100)"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative category-input-container">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={handleCategoryInputChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Type to search categories or create new"
                    required
                    className="flex-1 border border-gray-300 px-3 sm:px-4 py-2 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="px-2 sm:px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors flex-shrink-0"
                    title="Refresh categories"
                  >
                    <span className="text-sm sm:text-base">↻</span>
                  </button>
                </div>

                {/* Category Suggestions Dropdown */}
                {showSuggestions && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="px-4 py-3 text-gray-500 text-sm">Loading categories...</div>
                    ) : filteredCategories.length > 0 ? (
                      <>
                        {filteredCategories.map((cat, index) => (
                          <div key={cat.id || index}>
                            {/* Main category */}
                            <button
                              type="button"
                              onClick={() => handleCategorySelect(cat.title)}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-gray-900 font-medium">{cat.title}</span>
                                <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                  Category
                                </span>
                              </div>
                            </button>

                            {/* Subcategories */}
                            {cat.items && cat.items.map((subcat, subIndex) => (
                              <button
                                key={`${cat.id}-sub-${subIndex}`}
                                type="button"
                                onClick={() => handleCategorySelect(subcat)}
                                className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 pl-8"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-700 text-sm">↳ {subcat}</span>
                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                    Subcategory
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        ))}
                        {categoryInput.trim() && !filteredCategories.some(cat =>
                          (cat.title || cat.name)?.toLowerCase() === categoryInput.toLowerCase()
                        ) && (
                          <button
                            type="button"
                            onClick={handleCategorySubmit}
                            className="w-full px-4 py-3 text-left hover:bg-green-50 focus:bg-green-50 focus:outline-none border-b border-gray-100"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-900">Create "{categoryInput}"</span>
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                New
                              </span>
                            </div>
                          </button>
                        )}
                      </>
                    ) : categoryInput.trim() ? (
                      <button
                        type="button"
                        onClick={handleCategorySubmit}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 focus:bg-green-50 focus:outline-none"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900">Create "{categoryInput}"</span>
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                            New Category
                          </span>
                        </div>
                      </button>
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        Start typing to see suggestions or create a new category
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Selected Category Display */}
              {product.category && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-sm text-blue-800">
                    Selected: <strong>{product.category}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              required
              rows="4"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isTrending"
                id="isTrending"
                checked={product.isTrending}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="isTrending"
                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
              >
                Mark as Trending Product
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isTopProduct"
                id="isTopProduct"
                checked={product.isTopProduct}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label
                htmlFor="isTopProduct"
                className="ml-3 text-sm font-medium text-gray-700 cursor-pointer"
              >
                Mark as Top Product
              </label>
            </div>
          </div>

          {/* Images */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
              Product Images *
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
              Select images from your device (up to 4 images)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Image {i + 1} {i === 0 && <span className="text-red-500">(Required)</span>}
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e, i)}
                    className="w-full border-2 border-dashed border-gray-300 px-4 py-3 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                  />

                  {previews[i] && (
                    <div className="space-y-2">
                      <img
                        src={previews[i]}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-40 object-cover border-2 border-gray-200 rounded-lg shadow-sm"
                      />
                      <p className="text-xs text-green-600 font-medium">✓ Image Selected</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Add Product
            </button>
          </div>
        </form>

        {/* Debug Info */}
        <div className="mt-4 sm:mt-8 p-3 sm:p-4 bg-gray-100 rounded-lg">
          <details className="cursor-pointer">
            <summary className="font-medium text-gray-700 hover:text-gray-900">
              Debug Information
            </summary>
            <div className="mt-3 space-y-2 text-xs">
              <pre className="mt-1 p-2 bg-white rounded text-gray-600 overflow-x-auto">
                {JSON.stringify(product, null, 2)}
              </pre>
              <div className="text-amber-600 font-medium mt-2">
                Note: Images are sent as actual files to backend.
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;

