import React, { useState } from "react";


const ChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={`fixed right-5 bottom-5 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors duration-300
          ${isOpen ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {isOpen ? (
          <span className="text-white text-2xl font-bold leading-none cursor-pointer select-none">×</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed right-5 bottom-20 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col overflow-hidden"
          role="dialog"
          aria-modal="true"
        >
          <header className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Live Chat</h2>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="text-white text-2xl font-bold leading-none cursor-pointer select-none"
            >
              ×
            </button>
          </header>
          <div className="flex-grow p-4 overflow-y-auto">
            {/* Chat content goes here */}
            <p className="text-gray-700">Welcome! How can we help you today?</p>
          </div>
          <footer className="p-2 border-t border-gray-300">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </footer>
        </div>
      )}
    </>
  );
};

export default ChatButton;


