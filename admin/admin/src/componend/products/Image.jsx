import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const HeroNavbarImageUpload = () => {
  const [files, setFiles] = useState([null, null, null]);
  const [previews, setPreviews] = useState([]);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentImages, setCurrentImages] = useState([]);
  const { token } = useAuth();
  const fetchEndpoints = [
    "https://apii.ravorin.com/api/v1/hero-images",
    "https://apii.ravorin.com/api/v1/hero-navbar",
  ];
  const uploadEndpoints = [
    "https://apii.ravorin.com/api/v1/hero-images/upload",
    "https://apii.ravorin.com/api/v1/hero-navbar/upload",
  ];

  const fetchCurrentImages = async () => {
    for (const url of fetchEndpoints) {
      try {
        const res = await axios.get(url);
        if (res.data?.success) {
          setCurrentImages(Array.isArray(res.data.heroImages?.images) ? res.data.heroImages.images : []);
          return;
        }
      } catch (err) {
        if (err?.response?.status !== 404) {
          console.error("Error fetching hero images:", err);
          break;
        }
      }
    }
    setCurrentImages([]);
  };

  useEffect(() => {
    fetchCurrentImages();
  }, []);

  const handleFileChange = (index, file) => {
    const updatedFiles = [...files];
    updatedFiles[index] = file || null;
    setFiles(updatedFiles);

    const objectUrls = updatedFiles
      .filter(Boolean)
      .map((f) => URL.createObjectURL(f));
    setPreviews(objectUrls);
  };

  const handleUpload = async () => {
    if (files.some((f) => !f)) {
      alert("Please choose all 3 images first.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      setLoading(true);
      let uploaded = false;

      for (const url of uploadEndpoints) {
        try {
          const res = await axios.post(url, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });

          setResponse(res.data);
          if (res.data?.success) {
            uploaded = true;
            setFiles([null, null, null]);
            setPreviews([]);
            await fetchCurrentImages();
          }
          break;
        } catch (err) {
          if (err?.response?.status !== 404) {
            throw err;
          }
        }
      }

      if (!uploaded) {
        setResponse({ success: false, error: "Hero image upload route not found on backend. Restart backend server." });
      }
    } catch (err) {
      setResponse({ success: false, error: err.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Hero Images Management</h2>
          <p className="text-gray-600 mt-1">Upload up to 3 images for homepage hero section</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Hero Images</h3>
            {currentImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {currentImages.map((img, idx) => (
                  <div key={`${img}-${idx}`} className="relative">
                    <img
                      src={img}
                      alt={`Hero ${idx + 1}`}
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = '/no-image.svg';
                      }}
                    />
                    <span className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500">
                No hero images uploaded yet
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload New Images (Exactly 3)</h3>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(0, e.target.files?.[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(1, e.target.files?.[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(2, e.target.files?.[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {previews.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {previews.map((src, idx) => (
                    <div key={`${src}-${idx}`} className="rounded-lg overflow-hidden border border-blue-200">
                      <img src={src} alt={`Preview ${idx + 1}`} className="w-full h-36 object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={loading || files.some((f) => !f)}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
              >
                {loading ? "Uploading..." : "Upload Hero Images"}
              </button>
            </div>
          </div>

          {response && (
            <div className={`mt-4 p-4 border rounded-lg ${response.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <h3 className={`font-semibold ${response.success ? "text-green-800" : "text-red-800"}`}>
                {response.success ? "Success" : "Error"}
              </h3>
              <p className={`${response.success ? "text-green-700" : "text-red-700"}`}>
                {response.message || response.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroNavbarImageUpload;
