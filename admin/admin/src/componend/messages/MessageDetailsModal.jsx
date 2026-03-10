import { useState } from 'react';
import axios from 'axios';

const MessageDetailsModal = ({ message, onClose, onUpdate }) => {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(message.status || 'new');

  const handleSendReply = async () => {
    setSending(true);
    try {
      await axios.put(`https://apii.ravorin.com/messages/${message.id}`, {
        ...message,
        reply,
        status: 'replied',
      });
      alert('Reply sent!');
      onUpdate(); // refresh list
      onClose();
    } catch (err) {
      console.error('Failed to send reply', err);
      alert('Failed to reply');
    } finally {
      setSending(false);
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = status === 'resolved' ? 'new' : 'resolved';
    try {
      await axios.put(`https://apii.ravorin.com/messages/${message.id}`, {
        ...message,
        status: newStatus,
      });
      setStatus(newStatus);
      alert(`Marked as ${newStatus}`);
      onUpdate();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">Message Details</h2>

        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Name:</strong> {message.name}</p>
          <p><strong>Email:</strong> {message.email}</p>
          <p><strong>Subject:</strong> {message.subject}</p>
          <p><strong>Message:</strong></p>
          <p className="border p-3 rounded bg-gray-50 whitespace-pre-line">{message.message}</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Reply:</label>
          <textarea
            rows="3"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Write your reply here..."
          />
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded text-sm ${
              status === 'resolved' ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'
            }`}
          >
            Mark as {status === 'resolved' ? 'New' : 'Resolved'}
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSendReply}
              disabled={sending}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {sending ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailsModal;
