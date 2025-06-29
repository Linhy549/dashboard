import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TradeDashboard = () => {
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchTrades = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/trades/allTrades', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setTrades(response.data);
      setError(null);
      setSuccessMessage('Trades refreshed successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error fetching trades:', err);
      setError('Could not fetch trades. Please ensure the backend is running and CORS is configured correctly.');
    } finally {
      setLoading(false);
    }
  };

  const deleteTrade = async (tradeId) => {
    if (!window.confirm('Are you sure you want to delete this trade?')) return;
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/trades/${tradeId}`);
      fetchTrades(); // Refresh the list after deletion
    } catch (err) {
      console.error('Error deleting trade:', err);
      setError('Failed to delete trade.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  return (
    <div className="p-6 relative">
      {successMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow">
          {successMessage}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Trade History</h1>
        <button
          onClick={fetchTrades}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Refresh
        </button>
      </div>

      {loading && <div className="text-blue-600 mb-4">Processing...</div>}
      {error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Trade ID</th>
                <th className="px-4 py-2 border">Buy Order</th>
                <th className="px-4 py-2 border">Sell Order</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Timestamp</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr key={trade.tradeId} className="text-sm">
                  <td className="px-4 py-2 border">{trade.tradeId}</td>
                  <td className="px-4 py-2 border">{trade.buyOrderId}</td>
                  <td className="px-4 py-2 border">{trade.sellOrderId}</td>
                  <td className="px-4 py-2 border">${trade.price.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{trade.quantity}</td>
                  <td className="px-4 py-2 border">{new Date(trade.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => deleteTrade(trade.tradeId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TradeDashboard;
