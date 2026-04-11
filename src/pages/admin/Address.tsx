import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Card, Modal, Form, Popconfirm, InputNumber, message } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useStore, Address as AddressType } from '../../store';

export default function Address() {
  const { addresses, fetchAddresses, addAddress, updateAddress, deleteAddress } = useStore();
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (fetchAddresses) {
      fetchAddresses();
    }
  }, [fetchAddresses]);

  const handleAdd = () => {
    setEditingAddress(null);
    form.resetFields();
    form.setFieldsValue({});
    setIsModalOpen(true);
  };

  const handleEdit = (record: AddressType) => {
    setEditingAddress(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    let values;
    try {
      values = await form.validateFields();
    } catch (error) {
      console.error('Validation failed:', error);
      return;
    }

    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, values);
        message.success('修改成功');
      } else {
        await addAddress(values);
        message.success('新增成功');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('API call failed:', error);
      message.error('操作失败，请重试');
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    { title: '标准地址编码', dataIndex: 'id', key: 'id', width: 200 },
    { title: '地址名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '地址层级', dataIndex: 'level', key: 'level', width: 120 },
    { title: '地址类型', dataIndex: 'type', key: 'type', width: 120 },
    { title: '经度', dataIndex: 'longitude', key: 'longitude', width: 150 },
    { title: '纬度', dataIndex: 'latitude', key: 'latitude', width: 150 },
    { 
      title: '关联数据', 
      key: 'stats',
      width: 150,
      render: (_: any, record: AddressType) => (
        <Space size="middle">
          <span className="text-blue-600">人口: {record.populations?.length || 0}</span>
          <span className="text-green-600">房屋: {record.houses?.length || 0}</span>
        </Space>
      )
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: AddressType) => (
        <Space size="middle">
          <a className="text-blue-600" onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个地址吗？"
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

  const filteredData = addresses.filter(item => 
    item.name.includes(searchText) || item.id.includes(searchText)
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <EnvironmentOutlined className="mr-2" />
          标准地址台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索地址名称/编码"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增地址</Button>
          <Button icon={<DownloadOutlined />}>导出</Button>
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
        title={editingAddress ? '编辑地址' : '新增地址'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="id"
            label="标准地址编码"
            rules={[{ required: true, message: '请输入标准地址编码' }]}
          >
            <Input disabled={!!editingAddress} placeholder="例如：莲麻村-中田组-001号" />
          </Form.Item>
          <Form.Item
            name="name"
            label="地址名称"
            rules={[{ required: true, message: '请输入地址名称' }]}
          >
            <Input placeholder="请输入地址名称" />
          </Form.Item>
          <Form.Item
            name="level"
            label="地址层级"
            initialValue="村/网格"
          >
            <Input placeholder="例如：村/网格" />
          </Form.Item>
          <Form.Item
            name="type"
            label="地址类型"
            initialValue="住宅"
          >
            <Input placeholder="例如：住宅" />
          </Form.Item>
          <Form.Item
            name="longitude"
            label="经度"
            rules={[{ required: true, message: '请输入经度' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入经度" />
          </Form.Item>
          <Form.Item
            name="latitude"
            label="纬度"
            rules={[{ required: true, message: '请输入纬度' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="请输入纬度" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
