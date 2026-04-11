import { Table, Button, message, Space } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function Address() {
  const { addresses } = useStore();

  const handleExport = () => {
    message.success('导出任务已提交，请稍后在消息中心查看。');
  };

  const columns = [
    {
      title: '地址编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '地址名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '经度',
      dataIndex: 'longitude',
      key: 'longitude',
    },
    {
      title: '纬度',
      dataIndex: 'latitude',
      key: 'latitude',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a className="text-blue-600 hover:text-blue-800">编辑</a>
          <a className="text-red-600 hover:text-red-800">删除</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">标准地址管理</h2>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>新增地址</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>一键导出</Button>
        </Space>
      </div>
      <Table 
        columns={columns} 
        dataSource={addresses.map((addr) => ({ ...addr, key: addr.id }))} 
        pagination={{ pageSize: 10 }}
        className="shadow-sm border rounded-lg overflow-hidden"
      />
    </div>
  );
}
