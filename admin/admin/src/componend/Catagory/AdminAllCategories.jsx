import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminAllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editIdValue, setEditIdValue] = useState('');
  const [editName, setEditName] = useState('');
  const [editItems, setEditItems] = useState('');
  const [newIdValue, setNewIdValue] = useState('');
  const [newName, setNewName] = useState('');
  const [newItems, setNewItems] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryId, setNewSubcategoryId] = useState('');
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState('');
  const [editingSubId, setEditingSubId] = useState(null);
  const [editSubName, setEditSubName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [pendingAction, setPendingAction] = useState({ id: null, type: '' });
  const [toast, setToast] = useState({ message: '', type: '', visible: false });

  // Refresh categories function
  const refreshCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('https://apii.ravorin.com/api/v1/categories/admin');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      setCategories(data.categories || []);
      showToast('Categories refreshed', 'success');
    } catch (err) {
      setError('Error loading categories. Please try again.');
      showToast('Error refreshing categories', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch subcategories function
  const fetchSubcategories = async () => {
    try {
      const res = await fetch('https://apii.ravorin.com/api/v1/categories/subcategory?subcategory=true');
      if (!res.ok) throw new Error('Failed to fetch subcategories');
      const data = await res.json();
      setSubcategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('https://apii.ravorin.com/api/v1/categories/admin');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        console.log(data)
        setCategories(data.categories || []);
      } catch (err) {
        setError('Error loading categories. Please try again.');
        showToast('Error loading categories', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
    fetchSubcategories();
  }, []);

  // Show toast
  const showToast = (message, type) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: '', type: '', visible: false }), 3000);
  };

  // Edit category
  const handleEdit = (category) => {
    setEditingId(category.id);
    setEditIdValue(category.id);
    setEditName(category.title || category.name);
    setEditItems(Array.isArray(category.items) ? category.items.join(', ') : '');
  };

  // Save edited category
  const handleSave = async (category_id) => {
    // Re-validate fields before making the API call
    if (!editIdValue || !editIdValue.trim()) {
      setShowModal(null);
      return showToast('Category ID is required', 'error');
    }

    if (!editName || !editName.trim()) {
      setShowModal(null);
      return showToast('Category title is required', 'error');
    }

    try {
      const itemsArray = editItems ? editItems.split(',').map(item => item.trim()).filter(item => item.length > 0) : [];

      const res = await fetch(`https://apii.ravorin.com/api/v1/categories/${category_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editIdValue.trim(),
          title: editName.trim(),
          items: itemsArray
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update category');
      }

      const updated = await res.json();
      setCategories(prev => prev.map(cat => (cat.id === category_id ? updated.category : cat)));
      resetEdit();
      setShowModal(null);
      showToast('Category updated successfully', 'success');
    } catch (err) {
      setShowModal(null);
      showToast(`Error updating category: ${err.message}`, 'error');
    }
  };

  // Add new category
  const handleAdd = async () => {
    // Re-validate fields before making the API call
    if (!newIdValue || !newIdValue.trim()) {
      setShowModal(null);
      return showToast('Category ID is required', 'error');
    }

    if (!newName || !newName.trim()) {
      setShowModal(null);
      return showToast('Category title is required', 'error');
    }

    try {
      const itemsArray = newItems ? newItems.split(',').map(item => item.trim()).filter(item => item.length > 0) : [];

      const res = await fetch('https://apii.ravorin.com/api/v1/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newIdValue.trim(),
          title: newName.trim(),
          items: itemsArray
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add category');
      }

      const newCategory = await res.json();
      setCategories(prev => [...prev, newCategory.category]);
      resetNew();
      setShowModal(null);
      showToast('Category added successfully', 'success');
    } catch (err) {
      setShowModal(null);
      showToast(`Error adding category: ${err.message}`, 'error');
    }
  };

  // Delete category
  const handleDelete = async (category_id) => {
    try {
      const res = await fetch(`https://apii.ravorin.com/api/v1/categories/${category_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories(prev => prev.filter(cat => cat.category_id !== category_id));
        setShowModal(null);
        showToast('Category deleted successfully', 'success');
      } else if (res.status === 404) {
        // Category not found, remove from local state anyway
        setCategories(prev => prev.filter(cat => cat.category_id !== category_id));
        setShowModal(null);
        showToast('Category not found, removed from list', 'info');
      } else {
        throw new Error('Failed to delete category');
      }
    } catch {
      showToast('Error deleting category', 'error');
    }
  };

  // Confirm modal
  const confirmAction = (id, type) => {
    setPendingAction({ id, type });
    setShowModal(type);
  };

  // Reset edit
  const resetEdit = () => {
    setEditingId(null);
    setEditIdValue('');
    setEditName('');
    setEditItems('');
    setShowModal(null);
  };

  // Reset new input
  const resetNew = () => {
    setNewIdValue('');
    setNewName('');
    setNewItems('');
    setShowModal(null);
  };

  // Add new subcategory
  const handleAddSubcategory = async (categoryId) => {
    if (!newSubcategoryId.trim() || !newSubcategoryName.trim()) {
      return showToast('Subcategory ID এবং Name ফাঁকা রাখা যাবে না', 'error');
    }

    try {
      const res = await fetch('https://apii.ravorin.com/api/v1/categories/subcategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newSubcategoryId.trim(),
          title: newSubcategoryName.trim(),
          category_id: categoryId,
          items: []
        })
      });

      if (!res.ok) throw new Error('Failed to add subcategory');

      const newSubcategory = await res.json();
      setSubcategories(prev => [...prev, newSubcategory.category]);
      setNewSubcategoryId('');
      setNewSubcategoryName('');
      setSelectedCategoryForSub('');
      showToast('Subcategory added successfully', 'success');
    } catch (err) {
      showToast('Error adding subcategory', 'error');
    }
  };

  // Edit subcategory
  const handleEditSubcategory = (subcategory) => {
    setEditingSubId(subcategory.id);
    setEditSubName(subcategory.title || subcategory.name);
  };

  // Save edited subcategory
  const handleSaveSubcategory = async (subcategoryId) => {
    if (!editSubName.trim()) {
      return showToast('Subcategory name ফাঁকা রাখা যাবে না', 'error');
    }

    try {
      const res = await fetch(`https://apii.ravorin.com/api/v1/categories/${subcategoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editSubName.trim(),
          items: []
        })
      });

      if (!res.ok) throw new Error('Failed to update subcategory');

      const updated = await res.json();
      setSubcategories(prev => prev.map(sub =>
        sub.id === subcategoryId ? updated.category : sub
      ));
      resetSubcategoryEdit();
      showToast('Subcategory updated successfully', 'success');
    } catch (err) {
      showToast('Error updating subcategory', 'error');
    }
  };

  // Delete subcategory
  const handleDeleteSubcategory = async (subcategoryId) => {
    try {
      const res = await fetch(`https://apii.ravorin.com/api/v1/categories/${subcategoryId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSubcategories(prev => prev.filter(sub => sub.id !== subcategoryId));
        showToast('Subcategory deleted successfully', 'success');
      } else {
        throw new Error('Failed to delete subcategory');
      }
    } catch (err) {
      showToast('Error deleting subcategory', 'error');
    }
  };

  // Reset subcategory edit
  const resetSubcategoryEdit = () => {
    setEditingSubId(null);
    setEditSubName('');
  };

  // Get subcategories for a specific category
  const getSubcategoriesForCategory = (categoryId) => {
    return subcategories.filter(sub => sub.category_id === categoryId);
  };

  return (
    <div className="min-h-screen bg-white text-black p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin: Manage Categories</h1>
        <button
          onClick={refreshCategories}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {error && <div className="text-red-600 text-center mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          {/* Add New */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="font-semibold mb-2">Add New Category</h2>
            <input
              type="text"
              value={newIdValue}
              onChange={(e) => setNewIdValue(e.target.value)}
              placeholder="Category ID"
              className="w-full border p-2 mb-2"
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category Title"
              className="w-full border p-2 mb-2"
            />
            <textarea
              value={newItems}
              onChange={(e) => setNewItems(e.target.value)}
              placeholder="Items (comma-separated)"
              className="w-full border p-2 mb-2 h-20 resize-none"
              rows="3"
            />
            <button
              onClick={() => confirmAction(null, 'add')}
              className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
            >
              Add
            </button>
          </div>

          {/* Category List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                className="border p-4 rounded-lg shadow bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {editingId === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editIdValue}
                      onChange={(e) => setEditIdValue(e.target.value)}
                      placeholder="Category ID"
                      className="w-full border p-2 mb-2"
                    />
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Category Title"
                      className="w-full border p-2 mb-2"
                    />
                    <textarea
                      value={editItems}
                      onChange={(e) => setEditItems(e.target.value)}
                      placeholder="Items (comma-separated)"
                      className="w-full border p-2 mb-2 h-16 resize-none"
                      rows="2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmAction(cat.id, 'save')}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={resetEdit}
                        className="bg-gray-300 px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                  <h2 className="font-semibold text-center mb-1">
                      Category ID: {cat.id}
                    </h2>
                    <p className="text-center text-gray-700 mb-2">
                      Title: {cat.title || cat.name}
                    </p>

                    {/* Display Items */}
                    {cat.items && cat.items.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-600 mb-1">Items:</p>
                        <div className="flex flex-wrap gap-1 justify-center">
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmAction(cat.id, 'delete')}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>

                    {/* Subcategory Management */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-sm mb-2">Subcategories</h4>

                      {/* Add New Subcategory Form */}
                      <div className="mb-3 p-2 bg-gray-50 rounded">
                        <div className="flex gap-1 mb-2">
                          <input
                            type="text"
                            value={selectedCategoryForSub === cat.id ? newSubcategoryId : ''}
                            onChange={(e) => {
                              setNewSubcategoryId(e.target.value);
                              setSelectedCategoryForSub(cat.id);
                            }}
                            placeholder="Subcategory ID"
                            className="text-xs border p-1 rounded flex-1"
                          />
                          <input
                            type="text"
                            value={selectedCategoryForSub === cat.id ? newSubcategoryName : ''}
                            onChange={(e) => {
                              setNewSubcategoryName(e.target.value);
                              setSelectedCategoryForSub(cat.id);
                            }}
                            placeholder="Subcategory Name"
                            className="text-xs border p-1 rounded flex-1"
                          />
                        </div>
                        <button
                          onClick={() => handleAddSubcategory(cat.id)}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs w-full"
                        >
                          Add Subcategory
                        </button>
                      </div>

                      {/* Display Subcategories */}
                      <div className="space-y-2">
                        {getSubcategoriesForCategory(cat.id).map((sub) => (
                          <div key={sub.id} className="bg-blue-50 p-2 rounded text-sm">
                            {editingSubId === sub.id ? (
                              <div>
                                <input
                                  type="text"
                                  value={editSubName}
                                  onChange={(e) => setEditSubName(e.target.value)}
                                  className="text-xs border p-1 rounded w-full mb-1"
                                />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleSaveSubcategory(sub.id)}
                                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={resetSubcategoryEdit}
                                    className="bg-gray-300 px-2 py-1 rounded text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center">
                                <div>
                                  <span className="font-medium">{sub.title || sub.name}</span>
                                  <span className="text-gray-500 text-xs ml-2">({sub.id})</span>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleEditSubcategory(sub)}
                                    className="bg-blue-600 text-white px-1 py-0.5 rounded text-xs"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubcategory(sub.id)}
                                    className="bg-red-600 text-white px-1 py-0.5 rounded text-xs"
                                  >
                                    Del
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        {getSubcategoriesForCategory(cat.id).length === 0 && (
                          <p className="text-gray-500 text-xs text-center py-2">No subcategories</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
              <p className="mb-4">
                {showModal === 'save'
                  ? 'Save changes?'
                  : showModal === 'delete'
                  ? 'Delete this category?'
                  : 'Add new category?'}
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (showModal === 'save') handleSave(pendingAction.id);
                    else if (showModal === 'delete') handleDelete(pendingAction.id);
                    else handleAdd();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowModal(null)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast.visible && (
          <motion.div
            className={`fixed bottom-4 right-4 px-4 py-2 rounded text-white ${
              toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAllCategories;
