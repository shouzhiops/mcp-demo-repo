import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Mine from './Mine';
import Report from './Report';
import Tasks from './Tasks';
import Register from './Register';
import Addresses from './Addresses';
import Houses from './Houses';
import Units from './Units';
import Facilities from './Facilities';
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
          <Route path="/mine" element={<Mine />} />
          <Route path="/report" element={<Report />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/houses" element={<Houses />} />
          <Route path="/units" element={<Units />} />
          <Route path="/facilities" element={<Facilities />} />
        </Routes>
      </div>
    </div>
  );
}
