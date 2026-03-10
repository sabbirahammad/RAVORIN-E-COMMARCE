import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editItems, setEditItems] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newItems, setNewItems] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingSaveId, setPendingSaveId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '', visible: false });
  const [uploadingId, setUploadingId] = useState(null); // For loading indicator

  useEffect(() => {
    fetchCategories();
  }, []);

  const refreshCategories = async () => {
    await fetchCategories();
    showToast('Categories refreshed', 'success');
  };

const fetchCategories = async () => {
  try {
    setIsLoading(true);
    const res = await fetch('https://apii.ravorin.com/api/v1/categories/admin');
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    console.log(data); // <-- check this in console
    setCategories(Array.isArray(data.categories) ? data.categories : []);
  } catch (err) {
    setError('Error loading categories. Please try again.');
    showToast('Error loading categories', 'error');
  } finally {
    setIsLoading(false);
  }
};


  const handleImageUpload = (id, file) => {
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      showToast('Only JPG and PNG images are allowed.', 'error');
      return;
    }

    // Validate file size (<2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size must be less than 2MB', 'error');
      return;
    }

    setUploadingId(id);
    const reader = new FileReader();

    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;

        // Create form data for file upload
        const formData = new FormData();
        formData.append('image', file);

        const res = await fetch(`https://apii.ravorin.com/api/v1/categories/${id}/image`, {
          method: 'PATCH',
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to upload image');

        const updated = await res.json();
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? updated.category : cat))
        );
        showToast('Image updated successfully', 'success');
      } catch (err) {
        showToast('Error uploading image', 'error');
      } finally {
        setUploadingId(null);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleEdit = (id, currentName, currentItems) => {
    setEditingId(id);
    setEditValue(currentName);
    setEditItems(Array.isArray(currentItems) ? currentItems.join(', ') : '');
  };

  const handleSave = async () => {
    if (!editValue.trim()) {
      showToast('Category title cannot be empty', 'error');
      return;
    }

    try {
      const itemsArray = editItems.split(',').map(item => item.trim()).filter(item => item.length > 0);

      const res = await fetch(
        `https://apii.ravorin.com/api/v1/categories/${pendingSaveId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: editValue.trim(),
            items: itemsArray
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to update category');

      const updated = await res.json();
      setCategories((prev) =>
        prev.map((cat) => (cat.id === pendingSaveId ? updated.category : cat))
      );
      setEditingId(null);
      setEditValue('');
      setEditItems('');
      setShowModal(false);
      setPendingSaveId(null);
      showToast('Category updated successfully', 'success');
    } catch (err) {
      showToast('Error updating category', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://apii.ravorin.com/api/v1/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        showToast('Category deleted', 'success');
      } else if (res.status === 404) {
        // Category not found, remove from local state anyway
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        showToast('Category not found, removed from list', 'info');
      } else {
        throw new Error('Failed to delete category');
      }
    } catch (err) {
      showToast('Error deleting category', 'error');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory || !newCategory.trim()) {
      showToast('Category title cannot be empty', 'error');
      return;
    }

    if (categories.length >= 12) {
      showToast('Maximum 12 categories allowed', 'error');
      return;
    }

    try {
      // Generate a unique ID for the category
      const categoryId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

      const itemsArray = newItems ? newItems.split(',').map(item => item.trim()).filter(item => item.length > 0) : [];

      const res = await fetch(`https://apii.ravorin.com/api/v1/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCategory.trim(),
          items: itemsArray,
          id: categoryId,
          image: ''
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add category');
      }

      const added = await res.json();
      setCategories((prev) => [...prev, added.category]);
      setNewCategory('');
      setNewItems('');
      showToast('Category added successfully', 'success');
    } catch (err) {
      showToast(`Error adding category: ${err.message}`, 'error');
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };

  const confirmSave = (id) => {
    if (!editValue.trim()) {
      showToast('Please enter a category name', 'error');
      return;
    }
    setPendingSaveId(id);
    setShowModal(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setEditItems('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Admin: Manage Categories
        </h1>
        <button
          onClick={refreshCategories}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Add New Category */}
      <div className="max-w-lg mx-auto mb-8 space-y-3">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base w-full"
          placeholder="Category title (e.g., ACCESSORIES)"
        />
        <input
          type="text"
          value={newItems}
          onChange={(e) => setNewItems(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm sm:text-base w-full"
          placeholder="Items (comma-separated, e.g., Socks, Wallet, Belt)"
        />
        <button
          onClick={handleAddCategory}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm sm:text-base w-full"
        >
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center text-sm sm:text-base">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Image Section */}
              {cat.image ? (
                <div className="relative group">
                  <img
                    src={cat.image}
                    alt="Category"
                    className="w-24 h-24 object-cover rounded-full mb-3 cursor-pointer border"
                    onClick={() =>
                      document.getElementById(`file-input-${cat.id}`).click()
                    }
                  />
                  {uploadingId === cat.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-full">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              ) : (
                <label
                  htmlFor={`file-input-${cat.id}`}
                  className="cursor-pointer"
                >
                  <div className="w-24 h-24 border border-dashed border-gray-300 rounded-full flex items-center justify-center text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    <p className="text-xs">Upload Image</p>
                  </div>
                </label>
              )}

              <input
                type="file"
                id={`file-input-${cat.id}`}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(cat.id, e.target.files[0])}
              />

          {editingId === cat.id ? (
  <>
    <input
      type="text"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 mb-2 w-full text-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Enter category title"
    />
    <textarea
      value={editItems}
      onChange={(e) => setEditItems(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-2 mb-3 w-full text-center text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
      placeholder="Enter items (comma-separated)"
    />
    <div className="flex space-x-2 w-full">
      <button
        onClick={() => confirmSave(cat.id)}
        className="flex-1 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm sm:text-base transition-colors duration-200"
      >
        Save
      </button>
      <button
        onClick={cancelEdit}
        className="flex-1 text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm sm:text-base transition-colors duration-200"
      >
        Cancel
      </button>
    </div>
  </>
) : (
  <>
    <h3 className="text-base sm:text-lg font-semibold text-center mb-1 text-gray-800">
      {cat.title || cat.name}
    </h3>
    <p className="text-xs text-gray-500 mb-2 text-center">ID: {cat.id}</p>

    {/* Display Items */}
    {cat.items && cat.items.length > 0 && (
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-600 mb-1">Items:</p>
        <div className="flex flex-wrap gap-1">
          {cat.items.slice(0, 3).map((item, index) => (
            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {item}
            </span>
          ))}
          {cat.items.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              +{cat.items.length - 3} more
            </span>
          )}
        </div>
      </div>
    )}

    <div className="flex space-x-2 w-full">
      <button
        onClick={() => handleEdit(cat.id, cat.title || cat.name, cat.items)}
        className="flex-1 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(cat.id)}
        className="flex-1 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm"
      >
        Delete
      </button>
    </div>
  </>
)}

            </motion.div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-sm mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Save</h3>
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to save changes to this category?</p>
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="flex-1 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setPendingSaveId(null);
                  }}
                  className="flex-1 text-gray-700 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white text-sm sm:text-base ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
