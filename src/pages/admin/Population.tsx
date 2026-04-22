import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, Card, Modal, Form, Select, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function Population() {
  const { populations, addresses, addPopulation, updatePopulation, deletePopulation } = useStore();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePopulation(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await updatePopulation(editingId, values);
        message.success('更新成功');
      } else {
        await addPopulation(values);
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
    { title: '姓名', dataIndex: 'name', key: 'name', width: 120 },
    { title: '性别', dataIndex: 'gender', key: 'gender', width: 80 },
    { title: '身份证号', dataIndex: 'idCard', key: 'idCard', width: 180 },
    { 
      title: '联系电话', 
      dataIndex: 'phone', 
      key: 'phone',
      width: 150,
      render: (text: string) => text || <span className="text-gray-400">暂无</span>
    },
    {
      title: '人口类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => {
        if (!type) return null;
        let color = 'blue';
        if (type.includes('老人') || type.includes('儿童')) color = 'volcano';
        if (type.includes('外出')) color = 'geekblue';
        if (type.includes('干部') || type.includes('军人')) color = 'green';
        return <Tag color={color}>{type}</Tag>;
      },
    },
    { title: '居住地址编码', dataIndex: 'addressId', key: 'addressId', width: 250 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 180,
      render: (_, record: any) => (
        <Space size="middle">
          <a className="text-green-600" onClick={() => navigate(`/admin/population/graph/${record.id}`)}>查看图谱</a>
          <a className="text-blue-600" onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除该人口记录吗？"
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

  const filteredData = populations.filter(item => 
    item.name.includes(searchText) || item.addressId.includes(searchText) || (item.idCard && item.idCard.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <TeamOutlined className="mr-2" />
          实有人口台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索姓名/身份证/地址"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增人口</Button>
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
        title={editingId ? '编辑人口' : '新增人口'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="gender" label="性别">
            <Select placeholder="请选择性别" allowClear>
              <Select.Option value="男">男</Select.Option>
              <Select.Option value="女">女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="idCard" label="身份证号">
            <Input placeholder="请输入身份证号" />
          </Form.Item>
          <Form.Item name="phone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item name="type" label="人口类型">
            <Select placeholder="请选择人口类型" allowClear>
              <Select.Option value="老人">老人</Select.Option>
              <Select.Option value="儿童">儿童</Select.Option>
              <Select.Option value="外出">外出</Select.Option>
              <Select.Option value="干部">干部</Select.Option>
              <Select.Option value="军人">军人</Select.Option>
              <Select.Option value="普通居民">普通居民</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="addressId" label="居住地址" rules={[{ required: true, message: '请选择居住地址' }]}>
            <Select placeholder="请选择居住地址" showSearch optionFilterProp="children" allowClear>
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
