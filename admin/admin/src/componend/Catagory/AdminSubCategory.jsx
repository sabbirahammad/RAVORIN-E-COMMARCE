import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://apii.ravorin.com/api/v1/categories/subcategory";

const AdminCategoryMenu = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: "", name: "" });
  const [editForms, setEditForms] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all subcategories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_URL);
      setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Add new subcategory
  const handleAddCategory = async () => {
    if (!form.id.trim() || !form.name.trim()) return;

    try {
      const res = await axios.post(API_URL, {
        category_id: form.id.trim(),
        name: form.name.trim(),
      });
      setForm({ id: "", name: "" });
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  // Delete sub-subcategory
  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  // Update subcategory
  const handleUpdateCategory = async (id) => {
    const updated = editForms[id];
    if (!updated?.id || !updated?.name) return;

    try {
      await axios.put(`${API_URL}/${id}`, {
        category_id: updated.id.trim(),
        name: updated.name.trim(),
      });
      fetchCategories();
      // Clear the edit form for this category
      setEditForms((prev) => ({ ...prev, [id]: { id: "", name: "" } }));
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto text-sm">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Admin SubCategory Manager
      </h2>

      {/* Add New SubCategory */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Category ID"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
          className="border rounded px-3 py-2 w-32"
        />
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={handleAddCategory}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white shadow rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-semibold text-gray-800">
                  {cat.category_id || cat.id} - {cat.name || cat.title}
                </span>
              </div>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Delete
              </button>
            </div>

            {/* Edit Fields */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Category ID"
                value={editForms[cat.id]?.id || ""}
                onChange={(e) =>
                  setEditForms({
                    ...editForms,
                    [cat.id]: {
                      ...editForms[cat.id],
                      id: e.target.value,
                    },
                  })
                }
                className="border rounded px-2 py-1 w-32"
              />
              <input
                type="text"
                placeholder="Name"
                value={editForms[cat.id]?.name || ""}
                onChange={(e) =>
                  setEditForms({
                    ...editForms,
                    [cat.id]: {
                      ...editForms[cat.id],
                      name: e.target.value,
                    },
                  })
                }
                className="border rounded px-2 py-1 w-full"
              />
              <button
                onClick={() => handleUpdateCategory(cat.id)}
                className="bg-blue-600 text-white px-3 rounded"
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategoryMenu;

