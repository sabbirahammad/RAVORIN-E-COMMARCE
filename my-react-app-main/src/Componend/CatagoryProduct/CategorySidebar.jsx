import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useProduct } from '../../Context/UseContext';

const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-700 pb-2">
      <button
        onClick={() => setOpen(!open)}
        className="mb-1 flex w-full items-center justify-between text-left font-semibold"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="space-y-2 pl-1">{children}</div>}
    </div>
  );
};

const toCategoryLabel = (category) => {
  if (!category) return '';
  if (typeof category === 'string') return category;
  return category.title || category.name || category.label || '';
};

const toCategorySlug = (label) => label.toLowerCase().trim().replace(/\s+/g, '-');

const CategorySidebar = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { categories, loading, setSelectedCategory, setSelectedColorFamily, selectedColorFamily } = useProduct();
  const [showMore, setShowMore] = useState(false);

  const apiCategories = useMemo(() => {
    const mapped = (Array.isArray(categories) ? categories : [])
      .map((item) => {
        const label = toCategoryLabel(item);
        return label ? { label, slug: toCategorySlug(label) } : null;
      })
      .filter(Boolean);

    return mapped.filter(
      (item, index, self) => index === self.findIndex((entry) => entry.slug === item.slug)
    );
  }, [categories]);

  const colorFamily = ['Black', 'White', 'Blue', 'Grey', 'Brown', 'Green'];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.label.toLowerCase());
    navigate(`/category/${encodeURIComponent(category.slug)}`);
  };

  const handleColorToggle = (value) => {
    setSelectedColorFamily((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  return (
    <div className="w-full space-y-4 rounded-lg bg-[#1c1c1c] p-4 text-sm text-white shadow-md md:w-64">
      <Section title="Category">
        {loading ? (
          <p className="text-sm text-gray-400">Loading categories...</p>
        ) : apiCategories.length > 0 ? (
          <ul className="space-y-1">
            {(showMore ? apiCategories : apiCategories.slice(0, 8)).map((category) => (
              <li
                key={category.slug}
                className={`cursor-pointer transition hover:text-orange-400 ${
                  slug === category.slug ? 'font-medium text-orange-500' : ''
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category.label}
              </li>
            ))}
            {!showMore && apiCategories.length > 8 && (
              <li>
                <button
                  className="mt-1 text-xs text-cyan-400 hover:underline"
                  onClick={() => setShowMore(true)}
                >
                  VIEW MORE
                </button>
              </li>
            )}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No categories found</p>
        )}
      </Section>

      <Section title="Color Family">
        {colorFamily.map((color) => (
          <label key={color} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="accent-orange-500"
              checked={selectedColorFamily.includes(color)}
              onChange={() => handleColorToggle(color)}
            />
            <span>{color}</span>
          </label>
        ))}
      </Section>
    </div>
  );
};

export default CategorySidebar;
