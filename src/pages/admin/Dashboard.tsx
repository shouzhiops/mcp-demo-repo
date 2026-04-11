import { Row, Col, Card, Statistic } from 'antd';
import { HomeOutlined, EnvironmentOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function Dashboard() {
  const { orders, addresses } = useStore();
  const pendingOrders = orders.filter(o => o.status === '待分拨' || o.status === '待处置').length;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">工作台</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card className="shadow-sm">
            <Statistic
              title="标准地址总数"
              value={addresses.length}
              prefix={<EnvironmentOutlined className="text-blue-500" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-sm">
            <Statistic
              title="实有人口总数"
              value={1285}
              prefix={<UserOutlined className="text-green-500" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-sm">
            <Statistic
              title="隐患工单总数"
              value={orders.length}
              prefix={<FileTextOutlined className="text-orange-500" />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="shadow-sm">
            <Statistic
              title="待处理工单"
              value={pendingOrders}
              prefix={<FileTextOutlined className="text-red-500" />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">快捷操作</h3>
        <div className="flex gap-4">
          <Card hoverable className="w-48 text-center cursor-pointer" onClick={() => window.location.href = '/admin/address'}>
            <EnvironmentOutlined className="text-3xl text-blue-500 mb-2" />
            <div>地址管理</div>
          </Card>
          <Card hoverable className="w-48 text-center cursor-pointer" onClick={() => window.location.href = '/admin/population'}>
            <UserOutlined className="text-3xl text-green-500 mb-2" />
            <div>人口管理</div>
          </Card>
          <Card hoverable className="w-48 text-center cursor-pointer" onClick={() => window.location.href = '/admin/orders'}>
            <FileTextOutlined className="text-3xl text-orange-500 mb-2" />
            <div>工单分拨</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
