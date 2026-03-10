import React from 'react';
import {
  FaMapMarkerAlt,
  FaUndoAlt,
  FaShieldAlt,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { FiTruck } from 'react-icons/fi';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { BsQrCode } from 'react-icons/bs';

const DeliveryDetails = () => {
  return (
    <div
      className="bg-[#1e1e1e] text-gray-200 rounded-lg shadow-md 
                 px-4 py-5 sm:p-6 w-full max-w-sm mx-auto lg:mx-0 space-y-6 
                 lg:-mt-46  sm:-mt-14"
    >
      {/* Delivery Options */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm font-semibold text-white">
          <span>Delivery Options</span>
          <IoIosInformationCircleOutline className="text-gray-400 text-lg" />
        </div>

        <div className="flex items-start gap-3 text-sm">
          <FaMapMarkerAlt className="text-lg text-yellow-400 mt-1" />
          <div className="flex-1">
            <p>Dhaka, Dhaka North, Banani Road No. 12 - 19</p>
            <button className="text-blue-400 text-xs hover:underline mt-1">CHANGE</button>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm">
          <FiTruck className="text-lg text-yellow-400 mt-1" />
          <div className="flex-1">
            <p>Standard Delivery</p>
            <p className="text-xs text-gray-400">Guaranteed by 2–5 Jun</p>
          </div>
          <p className="text-white font-semibold whitespace-nowrap">৳60</p>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <FaMoneyBillWave className="text-lg text-yellow-400" />
          <p>Cash on Delivery Available</p>
        </div>
      </div>

      <hr className="border-gray-700" />

      {/* Return & Warranty */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm font-semibold text-white">
          <span>Return & Warranty</span>
          <IoIosInformationCircleOutline className="text-gray-400 text-lg" />
        </div>

        <div className="flex items-center gap-3 text-sm">
          <FaUndoAlt className="text-lg text-yellow-400" />
          <p>14 days easy return</p>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <FaShieldAlt className="text-lg text-yellow-400" />
          <p>Warranty not available</p>
        </div>
      </div>

      <hr className="border-gray-700" />

      {/* QR + App Promo */}
      <div className="flex items-center gap-4 mt-2 bg-[#2a2a2a] p-3 rounded-lg">
        <BsQrCode className="text-4xl shrink-0" />
        <div>
          <p className="text-xs sm:text-sm text-white font-medium mb-1">
            Download app to enjoy exclusive discounts!
          </p>
          <p className="text-[10px] text-gray-400">Scan with mobile</p>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;


