// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TradeDashboard from './components/TradeDashboard';
import OrderDashboard from './components/OrderDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/trade" element={<TradeDashboard />} />
        <Route path="/order" element={<OrderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
