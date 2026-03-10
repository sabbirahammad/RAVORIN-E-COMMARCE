import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import EditCustomerModal from './EditCustomerModal';

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('https://apii.ravorin.com/customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this customer?');
    if (!confirm) return;

    const res = await fetch(`https://apii.ravorin.com/customers/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert('Failed to delete customer');
    }
  };

  const handleSave = (updated) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  if (loading) {
    return <p className="p-4 text-gray-500">Loading customers...</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>

      {customers.length === 0 ? (
        <p className="text-gray-500">No customers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border bg-white rounded-xl">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Joined</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{customer.name}</td>
                  <td className="p-3">{customer.email}</td>
                  <td className="p-3">{customer.joined}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => setEditingCustomer(customer)}
                      className="p-1.5 rounded hover:bg-gray-100"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="p-1.5 rounded hover:bg-red-100 text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingCustomer && (
        <EditCustomerModal
          customer={editingCustomer}
          onClose={() => setEditingCustomer(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CustomerListPage;
