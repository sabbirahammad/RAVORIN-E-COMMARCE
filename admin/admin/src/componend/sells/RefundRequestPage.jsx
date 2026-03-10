// RefundRequestPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';

const RefundRequestPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const res = await axios.get('https://apii.ravorin.com/refunds');
        setRequests(res.data);
      } catch (err) {
        console.error('Failed to load refund requests:', err);
      }
    };
    fetchRefunds();
  }, []);

  const handleApprove = async (id) => {
    await axios.patch(`https://apii.ravorin.com/refunds/${id}`, { status: 'approved' });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  };

  const handleReject = async (id) => {
    await axios.patch(`https://apii.ravorin.com/refunds/${id}`, { status: 'rejected' });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800">Refund Requests</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Reason</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, i) => (
              <tr key={req.id} className="border-t">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{req.customer}</td>
                <td className="p-3">{req.reason}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    req.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : req.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {req.status}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="text-green-600 hover:bg-green-50 p-1.5 rounded"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="text-red-600 hover:bg-red-50 p-1.5 rounded"
                      >
                        <X size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RefundRequestPage;
