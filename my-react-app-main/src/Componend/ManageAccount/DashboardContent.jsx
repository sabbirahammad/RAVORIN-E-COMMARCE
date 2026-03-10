// import React from 'react';

// const DashboardContent = () => {
//   return (
//     <div className="flex-1 p-4 text-xs text-white space-y-4">
//       {/* Header */}
//       <h2 className="text-xl font-semibold mb-2">Manage My Account</h2>

//       {/* Info Boxes */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <div className="bg-[#0d0f1c] p-4 rounded shadow">
//           <h3 className="font-semibold mb-1">Personal Profile <span className="text-blue-400 text-[10px] cursor-pointer">| EDIT</span></h3>
//           <p className="text-sm">sabbir ahammad</p>
//           <label className="text-[10px] flex items-center mt-2">
//             <input type="checkbox" className="mr-1" /> Receive marketing SMS
//           </label>
//         </div>

//         <div className="bg-[#0d0f1c] p-4 rounded shadow">
//           <h3 className="font-semibold mb-1">Address Book <span className="text-blue-400 text-[10px] cursor-pointer">| EDIT</span></h3>
//           <p className="text-[10px] text-gray-400">DEFAULT SHIPPING ADDRESS</p>
//           <p className="text-sm font-bold mt-1">Sabbir ahammad</p>
//           <p className="text-[10px] text-gray-300 leading-tight">
//             elliotgonj bazar<br />
//             Chattogram - Comilla - Daudkandi - Daudkandi Eliotganj<br />
//             (+880) 1752551135
//           </p>
//         </div>

//         <div className="bg-[#0d0f1c] p-4 rounded shadow">
//           <p className="text-[10px] text-gray-400 mb-1">DEFAULT BILLING ADDRESS</p>
//           <p className="text-sm font-bold">Sabbir ahammad</p>
//           <p className="text-[10px] text-gray-300 leading-tight">
//             elliotgonj bazar<br />
//             Chattogram - Comilla - Daudkandi - Daudkandi Eliotganj<br />
//             (+880) 1752551135
//           </p>
//         </div>
//       </div>

//       {/* Recent Orders Section */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-3">Recent Orders</h2>
//         <div className="bg-[#0d0f1c] p-4 rounded shadow">
//           <p className="text-[10px] text-gray-400 mb-1">ORDER PLACED</p>
//           <div className="flex justify-between items-center text-sm">
//             <div>
//               <p className="font-bold text-white">#6521345</p>
//               <p className="text-[10px] text-gray-400">Placed on: 01 Jun 2025</p>
//             </div>
//             <div className="text-right">
//               <p className="text-yellow-400 text-[10px]">Pending</p>
//               <button className="text-blue-400 text-[10px]">View Details</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Wishlist Section */}
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-3">Wishlist</h2>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           {[1, 2, 3, 4].map((item) => (
//             <div
//               key={item}
//               className="bg-[#0d0f1c] p-3 rounded shadow flex flex-col items-center text-center"
//             >
//               <div className="w-full h-24 bg-gray-700 rounded mb-2"></div>
//               <p className="text-[10px] text-white font-semibold">Product {item}</p>
//               <button className="text-[10px] text-blue-400 mt-1">Move to Cart</button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Payment & Support Section */}
//       <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-[#0d0f1c] p-4 rounded shadow">
//           <h2 className="text-xl font-semibold mb-2">Payment Methods</h2>
//           <ul className="text-[10px] text-gray-300 space-y-1">
//             <li>Visa ending in 1234</li>
//             <li>Mastercard ending in 5678</li>
//             <li>bKash linked</li>
//           </ul>
//         </div>
//         <div className="bg-[#0d0f1c] p-4 rounded shadow">
//           <h2 className="text-xl font-semibold mb-2">Support</h2>
//           <p className="text-[10px] text-gray-300 leading-tight">
//             Need help with your orders or account?<br />
//             Call us: <span className="text-white font-semibold">09613-121212</span><br />
//             Email: <span className="text-white font-semibold">support@elitepass.com</span>
//           </p>
//         </div>
//       </div>

//       {/* Footer Section */}
//       <div className="mt-10 border-t border-gray-700 pt-4 text-center text-[10px] text-gray-500">
//         <p>© 2025 Elitepass. All rights reserved.</p>
//         <p>Terms & Conditions | Privacy Policy</p>
//       </div>
//     </div>
//   );
// };

// export default DashboardContent;

