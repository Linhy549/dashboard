import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderDashboard = () => {
  const [role, setRole] = useState('BUY');  // 'BUY' or 'SELL'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchOrders = async (orderType) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/orders?type=${orderType}`);
      setOrders(response.data);
      setError(null);
      setSuccessMessage(`Orders refreshed successfully for ${orderType}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/orders/${orderId}`);
      fetchOrders(role);
    } catch (err) {
      setError('Failed to cancel order.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(role);
  }, [role]);

  return (
    <div className="p-6 relative">
      {successMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow">
          {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{role === 'BUY' ? 'Buy Orders' : 'Sell Orders'}</h1>
        <div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          >
            <option value="BUY">Buyer</option>
            <option value="SELL">Seller</option>
          </select>
          <button
            onClick={() => fetchOrders(role)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <div className="text-blue-600 mb-4">Processing...</div>}
      {error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Timestamp</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orderId} className="text-sm">
                  <td className="px-4 py-2 border">{order.orderId}</td>
                  <td className="px-4 py-2 border">${order.price.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{order.quantity}</td>
                  <td className="px-4 py-2 border">{new Date(order.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => cancelOrder(order.orderId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No {role === 'BUY' ? 'buy' : 'sell'} orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderDashboard;
