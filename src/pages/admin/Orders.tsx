import React, { useState } from 'react';
import { Table, Button, Tag, Space, message, Modal, Input, Card, Form, Select, Popconfirm } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined, AlertOutlined, DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useStore, Order } from '../../store';

const { confirm } = Modal;
const { TextArea } = Input;
const { Option } = Select;

export default function Orders() {
  const { orders, addresses, addOrder, updateOrderFull, deleteOrder, updateOrderStatus } = useStore();
  const [searchText, setSearchText] = useState('');

  // 增删改查表单
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();

  // 状态流转表单
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [statusOrder, setStatusOrder] = useState<Order | null>(null);
  const [statusForm] = Form.useForm();

  const handleAdd = () => {
    setEditingOrder(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Order) => {
    setEditingOrder(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteOrder(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingOrder) {
        await updateOrderFull(editingOrder.id, values);
        message.success('编辑成功');
      } else {
        await addOrder(values);
        message.success('新增成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  // 点击分拨/督办/审核销账
  const handleStatusChangeClick = (record: Order) => {
    setStatusOrder(record);
    statusForm.setFieldsValue({ 
      status: record.status === '待分拨' ? '待处置' : 
              record.status === '已处置' ? '已销账' : record.status,
      handlerId: record.handlerId 
    });
    setIsStatusModalVisible(true);
  };

  const handleStatusModalOk = async () => {
    try {
      const values = await statusForm.validateFields();
      if (statusOrder) {
        await updateOrderStatus(statusOrder.id, values.status, values.handlerId ? Number(values.handlerId) : undefined);
        message.success('状态流转成功');
        setIsStatusModalVisible(false);
      }
    } catch (error) {
      console.error('Status Validation Failed:', error);
    }
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
      width: 120,
    },
    { 
      title: '隐患来源', 
      dataIndex: 'source', 
      key: 'source',
      width: 120,
      render: (source: string) => {
        let color = 'blue';
        if (source === '群众上报') color = 'green';
        if (source === '物联网告警') color = 'red';
        return <Tag color={color}>{source || '网格员巡查'}</Tag>;
      },
    },
    { 
      title: '优先级', 
      dataIndex: 'priority', 
      key: 'priority',
      width: 100,
      render: (priority: string) => {
        let color = 'orange';
        if (priority === '高') color = 'red';
        if (priority === '低') color = 'green';
        return <Tag color={color}>{priority || '中'}</Tag>;
      },
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
      title: '详情描述',
      dataIndex: 'description',
      key: 'description',
      width: 250,
      ellipsis: true,
    },
    {
      title: '关联地址',
      dataIndex: 'addressId',
      key: 'addressId',
      width: 200,
    },
    {
      title: '上报时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 250,
      render: (_: any, record: Order) => {
        return (
          <Space size="middle">
            {record.status === '待分拨' && (
              <Button type="primary" size="small" onClick={() => handleStatusChangeClick(record)}>分拨</Button>
            )}
            {record.status === '待处置' && (
              <Button type="default" size="small" onClick={() => handleStatusChangeClick(record)}>督办</Button>
            )}
            {record.status === '已处置' && (
              <Button type="primary" size="small" className="bg-green-600" onClick={() => handleStatusChangeClick(record)}>审核销账</Button>
            )}
            <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
            <Popconfirm title="确定要删除此工单吗？" onConfirm={() => handleDelete(record.id)}>
              <Button type="link" danger size="small" icon={<DeleteOutlined />}>删除</Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const filteredData = orders.filter(item => 
    item.type.includes(searchText) || item.addressId.includes(searchText) || item.description.includes(searchText) || ((item as any).source && (item as any).source.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <div className="flex flex-col">
          <span className="text-lg font-bold"><AlertOutlined className="mr-2" />隐患分拨调度</span>
          <span className="text-sm text-gray-500 font-normal mt-1">负责管理和流转群众上报的隐患工单</span>
        </div>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索类型/描述/地址/来源"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增工单</Button>
          <Button icon={<DownloadOutlined />}>导出台账</Button>
        </Space>
      }
    >
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingOrder ? '编辑工单' : '新增工单'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="type" label="隐患类型" rules={[{ required: true, message: '请输入隐患类型' }]}>
            <Input placeholder="如：环境卫生、公共设施等" />
          </Form.Item>
          <Form.Item name="status" label="当前状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select placeholder="请选择">
              <Option value="待分拨">待分拨</Option>
              <Option value="待处置">待处置</Option>
              <Option value="已处置">已处置</Option>
              <Option value="已销账">已销账</Option>
            </Select>
          </Form.Item>
          <Form.Item name="addressId" label="关联地址" rules={[{ required: true, message: '请选择关联地址' }]}>
            <Select placeholder="请选择地址" showSearch>
              {addresses.map(addr => (
                <Option key={addr.id} value={addr.id}>{addr.id}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="source" label="隐患来源">
            <Select placeholder="请选择">
              <Option value="群众上报">群众上报</Option>
              <Option value="物联网告警">物联网告警</Option>
              <Option value="网格员巡查">网格员巡查</Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="优先级">
            <Select placeholder="请选择">
              <Option value="高">高</Option>
              <Option value="中">中</Option>
              <Option value="低">低</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="详情描述">
            <TextArea rows={4} placeholder="请输入详情描述" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="工单状态流转"
        open={isStatusModalVisible}
        onOk={handleStatusModalOk}
        onCancel={() => setIsStatusModalVisible(false)}
        destroyOnClose
      >
        <Form form={statusForm} layout="vertical">
          <Form.Item name="status" label="目标状态" rules={[{ required: true, message: '请选择目标状态' }]}>
            <Select placeholder="请选择">
              <Option value="待分拨">待分拨</Option>
              <Option value="待处置">待处置</Option>
              <Option value="已处置">已处置</Option>
              <Option value="已销账">已销账</Option>
            </Select>
          </Form.Item>
          <Form.Item name="handlerId" label="处理人员ID (选填)">
            <Input type="number" placeholder="请输入处理人员ID" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
