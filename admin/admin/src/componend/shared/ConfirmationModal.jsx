const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 space-y-4 shadow-lg max-w-sm w-full">
        <p className="text-gray-700">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-1 rounded border border-gray-400 hover:bg-gray-100">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

