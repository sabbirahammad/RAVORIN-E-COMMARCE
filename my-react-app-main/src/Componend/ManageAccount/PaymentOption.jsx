import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/GoogleAuth";

const SubmitPaymentProofForm = () => {
  const { id } = useParams(); // Extracting 'id' from the URL
  const [formData, setFormData] = useState({
    transaction_id: "",
    payment_method: "",
    amount: "",
    screenshot: null,
    sender_number: "",
    sender_name: "",
    payment_date: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const {token}= useAuth();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // ✅ Convert file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Handle file upload for screenshot
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // ✅ Convert to base64 immediately
        const base64 = await convertToBase64(file);
        setFormData((prevState) => ({
          ...prevState,
          screenshot: base64, // Store base64 string instead of file
        }));
      } catch (error) {
        console.error("Error converting file to base64:", error);
        setErrors(prev => ({...prev, screenshot: "Failed to process image"}));
      }
    }
  };

  // Validation function
  const validate = () => {
    const newErrors = {};
    if (!formData.transaction_id) newErrors.transaction_id = "Transaction ID is required";
    if (!formData.payment_method) newErrors.payment_method = "Payment Method is required";
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!formData.screenshot) newErrors.screenshot = "Screenshot is required";
    if (!formData.sender_number) newErrors.sender_number = "Sender Number is required";
    if (!formData.sender_name) newErrors.sender_name = "Sender Name is required";
    if (!formData.payment_date) newErrors.payment_date = "Payment Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Updated submit form - Send as JSON
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      // ✅ Create JSON object (no FormData needed)
      const jsonData = {
        transaction_id: formData.transaction_id,
        payment_method: formData.payment_method,
        amount: parseFloat(formData.amount), // Convert to number
        screenshot: formData.screenshot, // Base64 string
        sender_number: formData.sender_number,
        sender_name: formData.sender_name,
        payment_date: formData.payment_date,
      };

      try {
        setLoading(true);
        console.log("Transaction ID:", id); // Log the ID to verify it's correct

        // ✅ Send as JSON with proper Content-Type
        const response = await axios.post(
          `https://apii.ravorin.com/api/v1/orders/${id}/payment-proof`, // Use dynamic id
          jsonData, // Send JSON object, not FormData
          {
            headers: {
              "Content-Type": "application/json", // ✅ JSON content type
              "Authorization": `Bearer ${token}`
            },
          }
        );

        console.log("Form submitted successfully:", response.data);
        alert("Payment proof submitted successfully!");

        // ✅ Optional: Reset form after success
        setFormData({
          transaction_id: "",
          payment_method: "",
          amount: "",
          screenshot: null,
          sender_number: "",
          sender_name: "",
          payment_date: "",
        });

      } catch (error) {
        console.error("Error submitting form:", error);
        if (error.response) {
          alert(`Server error: ${error.response.data.error || error.response.data.message}`);
        } else if (error.request) {
          alert("Network error: Unable to reach the server.");
        } else {
          alert(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#121318] text-white p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm sm:max-w-md p-4 sm:p-6 bg-[#1a1f24] rounded-lg">
        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 text-center">Submit Payment Proof</h2>

        {/* Transaction ID */}
        <div className="mb-3 sm:mb-4">
          <label htmlFor="transaction_id" className="block text-[10px] sm:text-sm font-semibold mb-1 sm:mb-2">
            Transaction ID
          </label>
          <input
            type="text"
            id="transaction_id"
            name="transaction_id"
            value={formData.transaction_id}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 bg-[#2e3338] border border-gray-600 text-white rounded-md text-[10px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter transaction ID"
          />
          {errors.transaction_id && <span className="text-red-500 text-[9px] sm:text-sm">{errors.transaction_id}</span>}
        </div>

        {/* Payment Method */}
        <div className="mb-3 sm:mb-4">
          <label htmlFor="payment_method" className="block text-[10px] sm:text-sm font-semibold mb-1 sm:mb-2">
            Payment Method
          </label>
          <select
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 bg-[#2e3338] border border-gray-600 text-white rounded-md text-[10px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select payment method</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="rocket">Rocket</option>
            <option value="bank">Bank Transfer</option>
          </select>
          {errors.payment_method && <span className="text-red-500 text-[9px] sm:text-sm">{errors.payment_method}</span>}
        </div>

        {/* Amount */}
        <div className="mb-3 sm:mb-4">
          <label htmlFor="amount" className="block text-[10px] sm:text-sm font-semibold mb-1 sm:mb-2">Amount</label>
          <input
            type="number"
            step="0.01"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 bg-[#2e3338] border border-gray-600 text-white rounded-md text-[10px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter amount"
          />
          {errors.amount && <span className="text-red-500 text-[9px] sm:text-sm">{errors.amount}</span>}
        </div>

        {/* Screenshot (File upload) */}
        <div className="mb-3 sm:mb-4">
          <label htmlFor="screenshot" className="block text-[10px] sm:text-sm font-semibold mb-1 sm:mb-2">
            Screenshot (Upload Image)
          </label>
          <input
            type="file"
            id="screenshot"
            name="screenshot"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 sm:p-3 bg-[#2e3338] border border-gray-600 text-white rounded-md text-[10px] sm:text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] sm:file:text-sm file:bg-orange-500 file:text-white hover:file:bg-orange-600"
          />
          {errors.screenshot && <span className="text-red-500 text-[9px] sm:text-sm">{errors.screenshot}</span>}

          {/* ✅ Show preview if image selected */}
          {formData.screenshot && (
            <div className="mt-2 flex flex-col items-center sm:items-start">
              <img
                src={formData.screenshot}
                alt="Preview"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border"
              />
              <p className="text-[9px] sm:text-sm text-gray-400 mt-1">Image selected</p>
            </div>
          )}
        </div>

        {/* Sender Number */}
        <div className="mb-3 sm:mb-4">
          <label htmlFor="sender_number" className="block text-[10px] sm:text-sm font-semibold mb-1 sm:mb-2">
            Phone Number
          </label>
          <input
            type="text"
            id="sender_number"
            name="sender_number"
            value={formData.sender_number}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 bg-[#2e3338] border border-gray-600 text-white rounded-md text-[10px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter phone number"
          />
          {errors.sender_number && <span className="text-red-500 text-[9px] sm:text-sm">{errors.sender_number}</span>}
        </div>

        {/* Sender Name */}
        <div className="mb-3 sm:mb-4">
          <label htmlFor="sender_name" className="block text-[10px] sm:text-sm font-semibold mb-1 sm:mb-2">Your Name</label>
          <input
            type="text"
            id="sender_name"
            name="sender_name"
            value={formData.sender_name}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 bg-[#2e3338] border border-gray-600 text-white rounded-md text-[10px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your name"
          />
          {errors.sender_name && <span className="text-red-500 text-[9px] sm:text-sm">{errors.sender_name}</span>}
        </div>

        {/* Payment Date */}
        <div className="mb-4 sm:mb-6">
          <label htmlFor="payment_date" className="block text-[10px] sm:text-sm font-semibold mb-1 sm:mb-2">
            Payment Date
          </label>
          <input
            type="date"
            id="payment_date"
            name="payment_date"
            value={formData.payment_date}
            onChange={handleChange}
            className="w-full p-2 sm:p-3 bg-[#2e3338] border border-gray-600 text-white rounded-md text-[10px] sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          {errors.payment_date && <span className="text-red-500 text-[9px] sm:text-sm">{errors.payment_date}</span>}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-2 sm:py-3 bg-[#3f4a53] text-white rounded-md hover:bg-[#5f7079] transition duration-300 disabled:opacity-50 text-[10px] sm:text-sm font-semibold disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Payment Proof"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitPaymentProofForm;





