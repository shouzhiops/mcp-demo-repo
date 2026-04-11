import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { QRCodeSVG } from 'qrcode.react';
import { 
  EnvironmentOutlined, 
  TeamOutlined, 
  AlertOutlined,
  MobileOutlined,
  DesktopOutlined
} from '@ant-design/icons';

export default function Dashboard() {
  const navigate = useNavigate();
  const { addresses, orders } = useStore();
  
  const pendingOrders = orders.filter(o => o.status === '待分拨' || o.status === '待处置').length;
  
  // 获取当前系统的主机地址，用于生成移动端二维码
  const mobileUrl = `${window.location.protocol}//${window.location.host}/mobile`;
  const screenUrl = `${window.location.protocol}//${window.location.host}/screen`;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">莲麻村治理中心 - 工作台概览</h2>
      
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card className="shadow-sm">
            <Statistic 
              title="已登记标准地址 (户)" 
              value={addresses.length} 
              prefix={<EnvironmentOutlined className="text-blue-500" />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-sm">
            <Statistic 
              title="本月隐患工单总数" 
              value={orders.length} 
              prefix={<AlertOutlined className="text-orange-500" />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-sm">
            <Statistic 
              title="待处理隐患 (件)" 
              value={pendingOrders} 
              valueStyle={{ color: '#cf1322' }}
              prefix={<AlertOutlined />} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="快捷入口" className="shadow-sm h-full">
            <div className="grid grid-cols-3 gap-4">
              <div 
                className="bg-blue-50 p-6 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-colors border border-blue-100"
                onClick={() => navigate('/admin/address')}
              >
                <EnvironmentOutlined className="text-3xl text-blue-600 mb-2" />
                <div className="font-medium text-blue-900">一标台账</div>
              </div>
              <div 
                className="bg-green-50 p-6 rounded-lg text-center cursor-pointer hover:bg-green-100 transition-colors border border-green-100"
                onClick={() => navigate('/admin/population')}
              >
                <TeamOutlined className="text-3xl text-green-600 mb-2" />
                <div className="font-medium text-green-900">四实台账</div>
              </div>
              <div 
                className="bg-orange-50 p-6 rounded-lg text-center cursor-pointer hover:bg-orange-100 transition-colors border border-orange-100"
                onClick={() => navigate('/admin/orders')}
              >
                <AlertOutlined className="text-3xl text-orange-600 mb-2" />
                <div className="font-medium text-orange-900">隐患分拨</div>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title="多端协同预览" className="shadow-sm h-full">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-white p-2 border border-gray-200 rounded shadow-sm mb-3">
                  <QRCodeSVG value={mobileUrl} size={120} />
                </div>
                <div className="font-medium text-gray-700 flex items-center mb-1">
                  <MobileOutlined className="mr-1" /> 移动端 (网格员使用)
                </div>
                <a 
                  href={mobileUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-700 break-all"
                >
                  {mobileUrl}
                </a>
              </div>
              
              <div className="w-full border-t border-gray-100 my-2"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="font-medium text-gray-700 flex items-center mb-1">
                  <DesktopOutlined className="mr-1" /> 指挥大屏 (大屏端)
                </div>
                <a 
                  href={screenUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-700 break-all"
                >
                  {screenUrl}
                </a>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
