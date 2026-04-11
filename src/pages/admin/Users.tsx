import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Card, Modal, Form, Select, Tag, message } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useStore, User } from '../../store';

export default function Users() {
  const { users, roles, fetchUsers, fetchRoles, updateUser } = useStore();
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  const handleEdit = (record: User) => {
    setEditingUser(record);
    form.setFieldsValue({
      status: record.status,
      roleIds: record.roles?.map(r => r.id) || [],
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateUser(id, { status });
      message.success('状态更新成功');
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await updateUser(editingUser.id, values);
        message.success('修改成功');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    { title: '用户ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username', key: 'username', width: 150 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 150 },
    { 
      title: '角色', 
      dataIndex: 'roles', 
      key: 'roles', 
      width: 150,
      render: (_: any, record: User) => (
        record.roles && record.roles.length > 0 
          ? record.roles.map(r => <Tag key={r.id} color="blue">{r.name}</Tag>) 
          : '无'
      )
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 120,
      render: (status: string) => {
        let color = 'default';
        let text = '未知';
        if (status === 'active') { color = 'success'; text = '正常'; }
        if (status === 'pending') { color = 'warning'; text = '待审核'; }
        if (status === 'rejected') { color = 'error'; text = '已拒绝'; }
        return <Tag color={color}>{text}</Tag>;
      }
    },
    { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt', width: 200, render: (text: string) => new Date(text).toLocaleString() },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: User) => (
        <Space size="middle">
          {record.status === 'pending' && (
            <>
              <a className="text-green-600" onClick={() => handleStatusChange(record.id, 'active')}>通过</a>
              <a className="text-red-600" onClick={() => handleStatusChange(record.id, 'rejected')}>拒绝</a>
            </>
          )}
          <a className="text-blue-600" onClick={() => handleEdit(record)}>编辑</a>
        </Space>
      ),
    },
  ];

  const filteredData = users.filter(item => 
    item.username.includes(searchText) || (item.name && item.name.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <UserOutlined className="mr-2" />
          村委班子
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索用户名/姓名"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
        </Space>
      }
    >
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="编辑用户信息"
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="roleIds"
            label="用户角色"
            rules={[{ required: true, message: '请至少选择一个角色' }]}
          >
            <Select mode="multiple" placeholder="请选择角色">
              {roles.map(role => (
                <Select.Option key={role.id} value={role.id}>{role.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="账号状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value="pending">待审核</Select.Option>
              <Select.Option value="active">正常</Select.Option>
              <Select.Option value="rejected">已拒绝</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
