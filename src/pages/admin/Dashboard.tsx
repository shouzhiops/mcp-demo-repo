import React from 'react';
import { Card, Row, Col, Statistic, List, Tag, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';
import { QRCodeSVG } from 'qrcode.react';
import { 
  EnvironmentOutlined, 
  TeamOutlined, 
  AlertOutlined,
  MobileOutlined,
  DesktopOutlined,
  HomeOutlined,
  ShopOutlined,
  SafetyOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

export default function Dashboard() {
  const navigate = useNavigate();
  const { addresses, populations, houses, units, facilities, orders } = useStore();
  
  const pendingOrdersList = orders.filter(o => o.status === '待分拨' || o.status === '待处置');
  const pendingOrders = pendingOrdersList.length;
  const recentPendingOrders = pendingOrdersList.slice(0, 5);
  
  // 获取当前系统的主机地址，用于生成移动端二维码
  const mobileUrl = `${window.location.protocol}//${window.location.host}/mobile`;
  const screenUrl = `${window.location.protocol}//${window.location.host}/screen`;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">莲麻村治理中心 - 工作台概览</h2>
      
      <Row gutter={[16, 16]} className="mb-6">
        <Col span={8}>
          <Card className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/address')}>
            <Statistic 
              title="已登记标准地址 (个)" 
              value={addresses.length} 
              prefix={<EnvironmentOutlined className="text-blue-500" />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/population')}>
            <Statistic 
              title="实有人口 (人)" 
              value={populations.length} 
              prefix={<TeamOutlined className="text-green-500" />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/house')}>
            <Statistic 
              title="实有房屋 (间)" 
              value={houses.length} 
              prefix={<HomeOutlined className="text-cyan-500" />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/unit')}>
            <Statistic 
              title="实有单位 (家)" 
              value={units.length} 
              prefix={<ShopOutlined className="text-purple-500" />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/facility')}>
            <Statistic 
              title="实有设施 (处)" 
              value={facilities.length} 
              prefix={<SafetyOutlined className="text-indigo-500" />} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/admin/orders')}>
            <Statistic 
              title="待处理隐患 (件)" 
              value={pendingOrders} 
              valueStyle={{ color: '#cf1322' }}
              prefix={<AlertOutlined className="text-red-500" />} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mb-6">
        <Col span={16}>
          <Card title="快捷入口" className="shadow-sm h-full">
            <div className="grid grid-cols-3 gap-4">
              <div 
                className="bg-blue-50 p-4 rounded-lg text-center cursor-pointer hover:bg-blue-100 transition-colors border border-blue-100 flex flex-col items-center justify-center"
                onClick={() => navigate('/admin/address')}
              >
                <EnvironmentOutlined className="text-3xl text-blue-600 mb-2" />
                <div className="font-medium text-blue-900">标准地址</div>
              </div>
              <div 
                className="bg-green-50 p-4 rounded-lg text-center cursor-pointer hover:bg-green-100 transition-colors border border-green-100 flex flex-col items-center justify-center"
                onClick={() => navigate('/admin/population')}
              >
                <TeamOutlined className="text-3xl text-green-600 mb-2" />
                <div className="font-medium text-green-900">实有人口</div>
              </div>
              <div 
                className="bg-cyan-50 p-4 rounded-lg text-center cursor-pointer hover:bg-cyan-100 transition-colors border border-cyan-100 flex flex-col items-center justify-center"
                onClick={() => navigate('/admin/house')}
              >
                <HomeOutlined className="text-3xl text-cyan-600 mb-2" />
                <div className="font-medium text-cyan-900">实有房屋</div>
              </div>
              <div 
                className="bg-purple-50 p-4 rounded-lg text-center cursor-pointer hover:bg-purple-100 transition-colors border border-purple-100 flex flex-col items-center justify-center"
                onClick={() => navigate('/admin/unit')}
              >
                <ShopOutlined className="text-3xl text-purple-600 mb-2" />
                <div className="font-medium text-purple-900">实有单位</div>
              </div>
              <div 
                className="bg-indigo-50 p-4 rounded-lg text-center cursor-pointer hover:bg-indigo-100 transition-colors border border-indigo-100 flex flex-col items-center justify-center"
                onClick={() => navigate('/admin/facility')}
              >
                <SafetyOutlined className="text-3xl text-indigo-600 mb-2" />
                <div className="font-medium text-indigo-900">实有设施</div>
              </div>
              <div 
                className="bg-red-50 p-4 rounded-lg text-center cursor-pointer hover:bg-red-100 transition-colors border border-red-100 flex flex-col items-center justify-center"
                onClick={() => navigate('/admin/orders')}
              >
                <AlertOutlined className="text-3xl text-red-600 mb-2" />
                <div className="font-medium text-red-900">隐患分拨</div>
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

      <Row>
        <Col span={24}>
          <Card 
            title={
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-2 text-blue-500" />
                最近待办隐患
              </div>
            } 
            className="shadow-sm"
          >
            <List
              dataSource={recentPendingOrders}
              locale={{ emptyText: '暂无待处理隐患' }}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="primary" size="small" onClick={() => navigate('/admin/orders')}>去处理</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<AlertOutlined className={item.status === '待分拨' ? 'text-red-500 text-xl' : 'text-orange-500 text-xl'} />}
                    title={
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.type}</span>
                        <Tag color={item.status === '待分拨' ? 'error' : 'warning'}>
                          {item.status}
                        </Tag>
                        {item.priority === '高' && <Tag color="red">高优先级</Tag>}
                      </div>
                    }
                    description={
                      <div className="text-gray-500 text-sm mt-1 flex gap-4">
                        <span>{item.description || '无详细描述'}</span>
                        <span>来源: {item.source || '未知'}</span>
                        <span>时间: {new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
