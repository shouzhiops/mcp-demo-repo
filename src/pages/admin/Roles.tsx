import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Input, Card, Modal, Form, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useStore, Role } from '../../store';

export default function Roles() {
  const { roles, fetchRoles, addRole, updateRole, deleteRole } = useStore();
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleAdd = () => {
    setEditingRole(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: Role) => {
    setEditingRole(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRole(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRole) {
        await updateRole(editingRole.id, values);
        message.success('修改成功');
      } else {
        await addRole(values);
        message.success('新增成功');
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
    { title: '角色ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '角色名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '权限说明', dataIndex: 'permissions', key: 'permissions', width: 300 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Role) => (
        <Space size="middle">
          <a className="text-blue-600" onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除这个角色吗？"
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

  const filteredData = roles.filter(item => 
    item.name.includes(searchText)
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <SafetyCertificateOutlined className="mr-2" />
          权限管理
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索角色名称"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增角色</Button>
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
        title={editingRole ? '编辑角色' : '新增角色'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称' }]}
          >
            <Input placeholder="请输入角色名称" />
          </Form.Item>
          <Form.Item
            name="permissions"
            label="权限说明"
          >
            <Input.TextArea rows={4} placeholder="请输入权限说明" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
