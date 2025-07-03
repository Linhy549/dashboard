import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderDashboard = () => {
  const [orders, setOrders] = useState({ BUY: [], SELL: [] });
  const [role, setRole] = useState('BUY');
  const [orderQty, setOrderQty] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      const buyRes = await axios.get('http://localhost:8080/orders?type=BUY');
      const sellRes = await axios.get('http://localhost:8080/orders?type=SELL');
      setOrders({ BUY: buyRes.data, SELL: sellRes.data });
      setSuccessMessage('Orders refreshed successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders.');
    }
  };

  const placeOrder = async () => {
    if (!orderQty || !orderPrice) {
      alert('Please enter both quantity and price.');
      return;
    }

    const order = {
      orderId: `${role.toLowerCase()}${Date.now()}`,
      type: role,
      quantity: parseInt(orderQty),
      price: parseFloat(orderPrice),
    };

    try {
      await axios.post('http://localhost:8080/placeOrder', order, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSuccessMessage(`${role} order placed successfully.`);
      setOrderQty('');
      setOrderPrice('');
      fetchOrders();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to place order.');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 relative">
      {successMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow">
          {successMessage}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Order Dashboard</h1>
        <div className="flex items-center gap-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border px-3 py-1 rounded"
          >
            <option value="BUY">Buyer</option>
            <option value="SELL">Seller</option>
          </select>
          <button
            onClick={fetchOrders}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mb-6 p-4 border rounded bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Place {role === 'BUY' ? 'Buy' : 'Sell'} Order</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="number"
            placeholder="Quantity"
            value={orderQty}
            onChange={(e) => setOrderQty(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-1/3"
            min="1"
          />
          <input
            type="number"
            placeholder="Price"
            value={orderPrice}
            onChange={(e) => setOrderPrice(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-1/3"
            step="0.01"
            min="0"
          />
          <button
            onClick={placeOrder}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow w-full sm:w-auto"
          >
            Place Order
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Buy Orders</h2>
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orders.BUY.map(order => (
                <tr key={order.orderId} className="text-sm">
                  <td className="px-4 py-2 border">{order.orderId}</td>
                  <td className="px-4 py-2 border">${order.price.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{order.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Sell Orders</h2>
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orders.SELL.map(order => (
                <tr key={order.orderId} className="text-sm">
                  <td className="px-4 py-2 border">{order.orderId}</td>
                  <td className="px-4 py-2 border">${order.price.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{order.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDashboard;
