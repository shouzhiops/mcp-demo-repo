import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Report from './Report';
import Tasks from './Tasks';
import Register from './Register';
import { useStore } from '../../store';

export default function MobileApp() {
  const { fetchAddresses, fetchOrders, fetchPopulations } = useStore();

  useEffect(() => {
    fetchAddresses();
    fetchOrders();
    fetchPopulations();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50 w-full sm:max-w-md mx-auto relative overflow-hidden shadow-xl">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </div>
  );
}
