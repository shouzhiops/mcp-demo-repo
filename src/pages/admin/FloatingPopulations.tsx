import React, { useState } from 'react';
import { Table, Button, Space, Input, Card, Modal, Form, Select, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function FloatingPopulations() {
  const { floatingRecords, populations, houses, addFloatingRecord, updateFloatingRecord, deleteFloatingRecord } = useStore();
  const [searchText, setSearchText] = useState('');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({});
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFloatingRecord(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (values.populationId !== undefined) values.populationId = Number(values.populationId);
      if (values.houseId !== undefined) values.houseId = Number(values.houseId);

      if (editingId) {
        await updateFloatingRecord(editingId, values);
        message.success('更新成功');
      } else {
        await addFloatingRecord(values);
        message.success('新增成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: '人口ID', dataIndex: 'populationId', key: 'populationId', width: 120 },
    { title: '房屋ID', dataIndex: 'houseId', key: 'houseId', width: 120 },
    { title: '来源地', dataIndex: 'origin', key: 'origin', width: 150 },
    { title: '流入原因', dataIndex: 'reason', key: 'reason', width: 200 },
    { title: '过期时间', dataIndex: 'expireDate', key: 'expireDate', width: 150 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 150,
      render: (_, record: any) => (
        <Space size="middle">
          <a className="text-blue-600" onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除该记录吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a className="text-red-600">删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = floatingRecords.filter(item => 
    (item.origin && item.origin.includes(searchText)) || 
    (item.reason && item.reason.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <UsergroupAddOutlined className="mr-2" />
          流动人口台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索来源地/原因"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" className="bg-gov-blue" icon={<PlusOutlined />} onClick={handleAdd}>新增记录</Button>
          <Button className="bg-gov-blue text-white" icon={<DownloadOutlined />}>导出</Button>
        </Space>
      }
    >
      <Table 
        bordered
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id"
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingId ? '编辑流动人口' : '新增流动人口'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="populationId" label="流动人口" rules={[{ required: true, message: '请选择流动人口' }]}>
            <Select placeholder="请选择流动人口" showSearch optionFilterProp="children" allowClear>
              {populations.map(p => (
                <Select.Option key={p.id} value={p.id}>{p.name} (ID: {p.id})</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="houseId" label="现住房屋" rules={[{ required: true, message: '请选择现住房屋' }]}>
            <Select placeholder="请选择现住房屋" showSearch optionFilterProp="children" allowClear>
              {houses.map(h => (
                <Select.Option key={h.id} value={h.id}>房屋ID: {h.id}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="origin" label="来源地" rules={[{ required: true, message: '请输入来源地' }]}>
            <Input placeholder="请输入来源地" />
          </Form.Item>
          <Form.Item name="reason" label="流入原因" rules={[{ required: true, message: '请输入流入原因' }]}>
            <Input placeholder="请输入流入原因（如务工、经商等）" />
          </Form.Item>
          <Form.Item name="expireDate" label="过期时间">
            <Input type="date" placeholder="请选择过期时间" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
