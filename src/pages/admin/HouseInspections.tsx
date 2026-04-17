import React, { useState } from 'react';
import { Table, Button, Space, Input, Card, Modal, Form, Select, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function HouseInspections() {
  const { houseInspections, addresses, addHouseInspection, updateHouseInspection, deleteHouseInspection } = useStore();
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
      await deleteHouseInspection(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await updateHouseInspection(editingId, values);
        message.success('更新成功');
      } else {
        await addHouseInspection(values);
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
    { title: '巡查人员', dataIndex: 'inspector', key: 'inspector', width: 150 },
    { title: '巡查结果', dataIndex: 'result', key: 'result', width: 250 },
    { title: '巡查地址', dataIndex: 'addressId', key: 'addressId', width: 200 },
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

  const filteredData = houseInspections.filter(item => 
    (item.inspector && item.inspector.includes(searchText)) || 
    (item.addressId && item.addressId.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <SafetyCertificateOutlined className="mr-2" />
          房屋巡查台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索巡查人员/地址"
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
        title={editingId ? '编辑巡查记录' : '新增巡查记录'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="inspector" label="巡查人员" rules={[{ required: true, message: '请输入巡查人员' }]}>
            <Input placeholder="请输入巡查人员姓名" />
          </Form.Item>
          <Form.Item name="result" label="巡查结果">
            <Select placeholder="请选择巡查结果" allowClear>
              <Select.Option value="正常">正常</Select.Option>
              <Select.Option value="存在隐患">存在隐患</Select.Option>
              <Select.Option value="需整改">需整改</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="addressId" label="巡查地址">
            <Select placeholder="请选择巡查地址" showSearch optionFilterProp="children" allowClear>
              {addresses.map(addr => (
                <Select.Option key={addr.id} value={addr.id}>{addr.id}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
