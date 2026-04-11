import React from 'react';
import { NavBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

export default function Units() {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 min-h-screen">
      <NavBar onBack={() => navigate(-1)} className="bg-white sticky top-0 z-10">
        单位管理
      </NavBar>
      <div className="p-4 text-center text-gray-500">开发中...</div>
    </div>
  );
}