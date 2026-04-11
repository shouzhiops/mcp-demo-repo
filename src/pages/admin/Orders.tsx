import { Table, Button, Tag, Space, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useStore, Order } from '../../store';

const { confirm } = Modal;

export default function Orders() {
  const { orders, updateOrderStatus } = useStore();

  const handleDispatch = (id: number) => {
    confirm({
      title: '确认派单?',
      icon: <ExclamationCircleOutlined />,
      content: '是否将此工单派发给处理人员(ID: 101)?',
      onOk() {
        updateOrderStatus(id, '待处置', 101);
        message.success('派单成功');
      },
    });
  };

  const handleVerify = (id: number) => {
    confirm({
      title: '确认核销?',
      icon: <ExclamationCircleOutlined />,
      content: '确认核销该工单，将其标记为已销账?',
      onOk() {
        updateOrderStatus(id, '已销账');
        message.success('核销成功');
      },
    });
  };

  const columns = [
    {
      title: '工单编号',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '隐患类型',
      dataIndex: 'type',
      key: 'type',
      width: 150,
    },
    {
      title: '隐患描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '地址信息',
      dataIndex: 'addressId',
      key: 'addressId',
      width: 200,
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: Order['status']) => {
        let color = 'default';
        if (status === '待分拨') color = 'error';
        if (status === '待处置') color = 'warning';
        if (status === '已处置') color = 'processing';
        if (status === '已销账') color = 'success';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Order) => {
        if (record.status === '待分拨') {
          return (
            <Button 
              type="primary" 
              size="small" 
              onClick={() => handleDispatch(record.id)}
            >
              派单
            </Button>
          );
        }
        if (record.status === '已处置') {
          return (
            <Button 
              type="primary" 
              size="small" 
              className="bg-green-600"
              onClick={() => handleVerify(record.id)}
            >
              核销
            </Button>
          );
        }
        return <span className="text-gray-400">暂无操作</span>;
      },
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">隐患分拨调度</h2>
        <p className="text-gray-500 mt-2">负责管理和流转群众上报的隐患工单</p>
      </div>
      <Table 
        columns={columns} 
        dataSource={orders.map(order => ({ ...order, key: order.id }))} 
        pagination={{ pageSize: 10 }}
        className="shadow-sm border rounded-lg overflow-hidden"
      />
    </div>
  );
}
