import React, { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import { useStore } from '../../store';
import MapLayer from './components/MapLayer';
import HeaderPanel from './components/HeaderPanel';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import 'leaflet/dist/leaflet.css';

export default function ScreenApp() {
  const { width, height } = useWindowSize();
  const [scale, setScale] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { 
    fetchAddresses, 
    fetchOrders, 
    fetchPopulations, 
    fetchHouses, 
    fetchUnits, 
    fetchFacilities, 
    fetchConfig,
    config
  } = useStore();

  // 1. 初始化全量数据
  useEffect(() => {
    fetchConfig();
    fetchAddresses();
    fetchPopulations();
    fetchHouses();
    fetchUnits();
    fetchFacilities();
    fetchOrders();

    // 保留工单的 10 秒轮询
    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // 2. 等比例自适应缩放计算 (基准: 1920x1080)
  useEffect(() => {
    const baseWidth = 1920;
    const baseHeight = 1080;
    const scaleWidth = width / baseWidth;
    const scaleHeight = height / baseHeight;
    // 取宽和高中较小的缩放比例，确保完整显示不被裁剪
    const currentScale = Math.min(scaleWidth, scaleHeight);
    setScale(currentScale);
  }, [width, height]);

  // 处理未配置地图 Key 的降级状态
  if (!config?.tiandituKey) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 shadow-2xl text-center max-w-md">
          <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">未配置天地图 API Key</h2>
          <p className="text-gray-400">
            请前往管理后台的「系统全局设置」页面，配置您的天地图 API Key 后即可进入可视化指挥大屏。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#020617] overflow-hidden flex items-center justify-center">
      {/* 大屏内容主容器 */}
      <div 
        className="relative origin-center"
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
        }}
      >
        {/* 1. 底部地图层 */}
        <MapLayer selectedOrderId={selectedOrderId} />

        {/* 2. 顶部核心指标看板 */}
        <HeaderPanel />

        {/* 3. 左侧数据图表层 */}
        <LeftPanel />

        {/* 4. 右侧实时预警层 */}
        <RightPanel onOrderSelect={setSelectedOrderId} selectedOrderId={selectedOrderId} />
      </div>
    </div>
  );
}