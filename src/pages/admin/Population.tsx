import { Table, Button, message, Space } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';

export default function Population() {
  const handleExport = () => {
    message.success('导出任务已提交，请稍后在消息中心查看。');
  };

  const mockData = [
    { id: '1', name: '张三', gender: '男', age: 45, phone: '13800138000', address: '新华村-1组-001号', type: '户籍人口' },
    { id: '2', name: '李四', gender: '女', age: 32, phone: '13900139000', address: '新华村-2组-002号', type: '常住人口' },
    { id: '3', name: '王五', gender: '男', age: 28, phone: '13700137000', address: '新华村-3组-015号', type: '流动人口' },
    { id: '4', name: '赵六', gender: '女', age: 60, phone: '13600136000', address: '新华村-1组-002号', type: '重点关爱人口' },
    { id: '5', name: '孙七', gender: '男', age: 12, phone: '13500135000', address: '新华村-2组-003号', type: '户籍人口' },
  ];

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '居住地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '人口类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => {
        let color = 'text-gray-600 bg-gray-100';
        if (text === '重点关爱人口') color = 'text-red-600 bg-red-100';
        if (text === '流动人口') color = 'text-blue-600 bg-blue-100';
        if (text === '户籍人口') color = 'text-green-600 bg-green-100';
        
        return (
          <span className={`px-2 py-1 rounded text-xs ${color}`}>
            {text}
          </span>
        );
      }
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <a className="text-blue-600 hover:text-blue-800">查看</a>
          <a className="text-blue-600 hover:text-blue-800">编辑</a>
          <a className="text-red-600 hover:text-red-800">删除</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">实有人口管理</h2>
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>新增人口</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>一键导出</Button>
        </Space>
      </div>
      <Table 
        columns={columns} 
        dataSource={mockData.map((p) => ({ ...p, key: p.id }))} 
        pagination={{ pageSize: 10 }}
        className="shadow-sm border rounded-lg overflow-hidden"
      />
    </div>
  );
}
