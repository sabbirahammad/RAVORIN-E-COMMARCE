import { useState, useEffect } from 'react';

const EditProductModal = ({ product, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    ...product,
    images: Array.isArray(product.images) ? product.images : product.images ? [product.images] : ['', '', '', ''],
    description: product.description || '',
    isTrending: product.isTrending || false,
    isTopProduct: product.isTopProduct || false,
  });

  const [previews, setPreviews] = useState(formData.images.map((img) => img || ''));
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFormData({
      ...product,
      images: Array.isArray(product.images) ? product.images : product.images ? [product.images] : ['', '', '', ''],
      description: product.description || '',
      isTrending: product.isTrending || false,
      isTopProduct: product.isTopProduct || false,
    });
    setPreviews(formData.images.map((img) => img || ''));
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('image')) {
      const index = Number(name.replace('image', ''));
      setFormData((prev) => {
        const updatedImages = [...prev.images];
        updatedImages[index] = value;
        return { ...prev, images: updatedImages };
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleFileUpload = (file, index) => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const updatedPreviews = [...previews];
        updatedPreviews[index] = fileReader.result;
        setPreviews(updatedPreviews);
      };
      fileReader.readAsDataURL(file);
    }
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = file.name;
      return { ...prev, images: updatedImages };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProduct = { ...formData };

    setUploading(true);

    const res = await fetch(`https://apii.ravorin.com/api/v1/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });

    setUploading(false);

    if (res.ok) {
      onUpdate();
      onClose();
    } else {
      alert('Failed to update product');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-lg space-y-4 h-auto max-h-[80vh] overflow-auto">
        <h2 className="text-lg font-semibold text-gray-800">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Product Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-2 py-1 text-sm rounded"
              required
            />
          </div>

          {/* SKU */}
          <div>
            <label className="block mb-1 text-sm font-medium">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full border px-2 py-1 text-sm rounded"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 text-sm font-medium">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border px-2 py-1 text-sm rounded"
              required
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block mb-1 text-sm font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border px-2 py-1 text-sm rounded"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 text-sm font-medium">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border px-2 py-1 text-sm rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              className="w-full border px-2 py-1 text-sm rounded"
            />
          </div>

          {/* Image Uploads */}
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <label className="block mb-1 text-sm font-medium">Image {i + 1}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0], i)}
                className="w-full border px-2 py-1 text-sm rounded"
              />
              {previews[i] && (
                <img
                  src={previews[i]}
                  alt={`Preview ${i + 1}`}
                  className="w-16 h-16 mt-2 object-cover border rounded"
                />
              )}
            </div>
          ))}

          {uploading && <p className="text-blue-600 text-sm">Uploading image...</p>}

          {/* Trending Product */}
          <div className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              name="isTrending"
              checked={formData.isTrending}
              onChange={handleChange}
            />
            <label>Trending Product</label>
          </div>

          {/* Top Product */}
          <div className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              name="isTopProduct"
              checked={formData.isTopProduct}
              onChange={handleChange}
            />
            <label>Top Product</label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-black text-sm">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;



