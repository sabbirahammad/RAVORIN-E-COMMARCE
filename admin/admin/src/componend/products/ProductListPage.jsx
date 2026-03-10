import { useEffect, useState, useMemo } from "react";
import { Pencil, Trash2, X, Upload } from "lucide-react";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const ITEMS_PER_PAGE = 10;

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [editFormData, setEditFormData] = useState({
    name: "",
    price: "",
    discount: "",
    category: "",
    isTrending: false,
    isTopProduct: false,
    description: "",
  });

  const [editPreviews, setEditPreviews] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);

  // Sync edit form when editProduct changes
  useEffect(() => {
    if (!editProduct) return;
    
    const productImages = Array.isArray(editProduct.images) ? editProduct.images : [];
    
    setEditFormData({
      name: editProduct.name || "",
      price: editProduct.price?.toString() || "",
      discount: (editProduct.discount ?? 0).toString(),
      category: editProduct.category || "",
      isTrending: !!editProduct.isTrending,
      isTopProduct: !!editProduct.isTopProduct,
      description: editProduct.description || "",
    });

    setEditPreviews([...productImages]);
    setNewImageFiles([]);
  }, [editProduct]);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://apii.ravorin.com/api/v1/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      if (!Array.isArray(data.products)) throw new Error("Invalid data format");
      setProducts(data.products);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const uniqueCategories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) =>
        selectedCategory ? p.category?.toLowerCase() === selectedCategory.toLowerCase() : true
      )
      .filter((p) =>
        debouncedSearchTerm
          ? p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          : true
      );
  }, [products, selectedCategory, debouncedSearchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Delete product
  const handleDelete = async (id, images = []) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeleteLoadingId(id);
    try {
      const publicIds = images.map(url => {
        try {
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split('/');
          const filename = pathParts[pathParts.length - 1];
          return filename.split('.')[0];
        } catch (e) {
          return url;
        }
      }).filter(Boolean);

      const res = await fetch(`https://apii.ravorin.com/api/v1/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ publicIds }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Delete failed");
      }
      
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      alert("Product deleted successfully!");
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
      console.error("Delete error:", err);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setEditPreviews(prev => [...prev, previewUrl]);
    setNewImageFiles(prev => [...prev, file]);
  };

  const handleRemoveImage = (index) => {
    const existingCount = Array.isArray(editProduct?.images) ? editProduct.images.length : 0;
    
    // Remove from previews
    setEditPreviews(prev => prev.filter((_, i) => i !== index));
    
    // If it's a new image, remove from newImageFiles
    if (index >= existingCount) {
      const newFileIndex = index - existingCount;
      setNewImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
    }
    // Note: If it's an existing image, we assume it's just being hidden.
    // To delete it from Cloudinary, you'd need to track removed existing images.
    // For simplicity, this version only removes on full delete.
  };

  const handleEditSubmit = async () => {
    if (editPreviews.length === 0) {
      alert("Please add at least 1 image");
      return;
    }

    try {
      const productId = editProduct.id || editProduct._id;
      const formData = new FormData();
      
      formData.append('name', editFormData.name);
      formData.append('price', parseFloat(editFormData.price));
      formData.append('discount', Number(editFormData.discount || 0));
      formData.append('category', editFormData.category);
      formData.append('isTrending', editFormData.isTrending);
      formData.append('isTopProduct', editFormData.isTopProduct);
      formData.append('description', editFormData.description);
      
      // Get existing images count
      const existingCount = Array.isArray(editProduct?.images) ? editProduct.images.length : 0;
      
      // Keep existing images that are still in previews
      const keptExistingImages = editPreviews.slice(0, existingCount);
      keptExistingImages.forEach(img => {
        formData.append('existingImages', img);
      });
      
      // Add new image files
      newImageFiles.forEach(file => {
        formData.append('images', file);
      });

      const res = await fetch(`https://apii.ravorin.com/api/v1/products/${productId}`, {
        method: "PUT",
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Update failed");
      }
      
      const data = await res.json();
      
      setProducts((prev) =>
        prev.map((p) => {
          const pId = p.id || p._id;
          return pId === productId ? data.product : p;
        })
      );
      
      alert("Product updated successfully!");
      setEditProduct(null);
    } catch (err) {
      console.error("Update error:", err);
      alert(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-8">
        {/* Edit Modal */}
        {editProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 sm:p-4 z-50 overflow-y-auto">
            <div className="bg-white shadow-lg p-4 sm:p-8 rounded-xl border border-gray-100 max-w-4xl w-full mt-8 sm:mt-16 mb-8 sm:mb-16">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Edit Product</h2>
                <button
                  onClick={() => setEditProduct(null)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Product Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      name="discount"
                      value={editFormData.discount}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Electronics"
                    />
                  </div>

                  <div className="flex items-center space-x-6 mt-8">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isTrending"
                        checked={editFormData.isTrending}
                        onChange={handleEditChange}
                        className="h-5 w-5 text-blue-600 rounded"
                      />
                      <span className="text-gray-700 font-medium">Trending</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isTopProduct"
                        checked={editFormData.isTopProduct}
                        onChange={handleEditChange}
                        className="h-5 w-5 text-blue-600 rounded"
                      />
                      <span className="text-gray-700 font-medium">Top Product</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows={4}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Product description..."
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Product Images * (At least 1 required)
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                    {editPreviews.map((preview, i) => (
                      <div key={i} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${i + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleAddImageFile(e.target.files[0]);
                          e.target.value = '';
                        }
                      }}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition text-center bg-white">
                      <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                      <p className="text-sm text-gray-600 font-medium">Click to add more images</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (Max 5MB each)</p>
                    </div>
                  </label>
                </div>

                <div className="pt-6 border-t border-gray-200 flex space-x-4">
                  <button
                    onClick={() => setEditProduct(null)}
                    className="flex-1 bg-gray-200 text-gray-700 font-semibold px-6 py-4 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    className="flex-1 bg-blue-600 text-white font-semibold px-6 py-4 rounded-lg hover:bg-blue-700 transition-all"
                  >
                    Update Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <div className="flex flex-col space-y-4 mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Product Management
            </h1>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm sm:text-base flex-1"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 text-sm sm:text-base"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchProducts}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              {filteredProducts.length === 0 && products.length > 0
                ? "No products match your search"
                : "No products found"}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Price</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Discount</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Category</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Images</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Trending</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Top</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((p) => {
                      const productImages = Array.isArray(p.images) ? p.images.filter(img => img) : [];
                      return (
                        <tr key={p.id || p._id} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{p.name}</td>
                          <td className="px-4 py-3">${parseFloat(p.price).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded text-xs font-medium bg-rose-100 text-rose-700">
                              {Number(p.discount) > 0 ? `${Number(p.discount)}%` : "0%"}
                            </span>
                          </td>
                          <td className="px-4 py-3">{p.category}</td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-1">
                              {productImages.slice(0, 3).map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt={`${p.name} ${i + 1}`}
                                  className="w-12 h-12 object-cover rounded border border-gray-200"
                                />
                              ))}
                              {productImages.length > 3 && (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600 font-medium">
                                  +{productImages.length - 3}
                                </div>
                              )}
                              {productImages.length === 0 && (
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                                  No images
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${p.isTrending ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {p.isTrending ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${p.isTopProduct ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                              {p.isTopProduct ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setEditProduct(p)}
                                className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id || p._id, p.images || [])}
                                className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50"
                                disabled={deleteLoadingId === (p.id || p._id)}
                                title="Delete"
                              >
                                {deleteLoadingId === (p.id || p._id) ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {paginatedProducts.map((p) => {
                  const productImages = Array.isArray(p.images) ? p.images.filter(img => img) : [];
                  return (
                    <div key={p.id || p._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{p.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            ${parseFloat(p.price).toFixed(2)} • {Number(p.discount) > 0 ? `${Number(p.discount)}% OFF` : "0% OFF"} • {p.category}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-3">
                          <button
                            onClick={() => setEditProduct(p)}
                            className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id || p._id, p.images || [])}
                            className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition disabled:opacity-50"
                            disabled={deleteLoadingId === (p.id || p._id)}
                            title="Delete"
                          >
                            {deleteLoadingId === (p.id || p._id) ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Images */}
                      {productImages.length > 0 && (
                        <div className="flex space-x-2 mb-3 overflow-x-auto">
                          {productImages.slice(0, 3).map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`${p.name} ${i + 1}`}
                              className="w-16 h-16 object-cover rounded border border-gray-200 flex-shrink-0"
                            />
                          ))}
                          {productImages.length > 3 && (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">
                              +{productImages.length - 3}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Status badges */}
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${p.isTrending ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {p.isTrending ? "Trending" : "Not Trending"}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${p.isTopProduct ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {p.isTopProduct ? "Top Product" : "Regular"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition ${
                      pageNum === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
