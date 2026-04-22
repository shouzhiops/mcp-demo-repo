import React, { useState } from 'react';
import { Table, Button, Space, Input, Card, Modal, Form, Select, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, ProjectOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useStore();
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
      await deleteProject(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (values.investment !== undefined) values.investment = Number(values.investment);
      if (values.area !== undefined) values.area = Number(values.area);
      if (values.leaderId !== undefined) values.leaderId = Number(values.leaderId);

      if (editingId) {
        await updateProject(editingId, values);
        message.success('更新成功');
      } else {
        await addProject(values);
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
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '投资金额', dataIndex: 'investment', key: 'investment', width: 120 },
    { title: '占地面积', dataIndex: 'area', key: 'area', width: 120 },
    { title: '项目进度', dataIndex: 'progress', key: 'progress', width: 150 },
    { title: '困难问题', dataIndex: 'difficulties', key: 'difficulties', width: 200 },
    { title: '负责人ID', dataIndex: 'leaderId', key: 'leaderId', width: 100 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 150,
      render: (_, record: any) => (
        <Space size="middle">
          <a className="text-blue-600" onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除该项目吗？"
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

  const filteredData = projects.filter(item => 
    (item.name && item.name.includes(searchText)) || 
    (item.progress && item.progress.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <ProjectOutlined className="mr-2" />
          工程项目台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索项目名称/地址"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" className="bg-gov-blue" icon={<PlusOutlined />} onClick={handleAdd}>新增项目</Button>
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
        title={editingId ? '编辑项目' : '新增项目'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="项目名称" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item name="investment" label="投资金额" rules={[{ required: true, message: '请输入投资金额' }]}>
            <Input type="number" step="0.01" placeholder="请输入投资金额" />
          </Form.Item>
          <Form.Item name="area" label="占地面积" rules={[{ required: true, message: '请输入占地面积' }]}>
            <Input type="number" step="0.01" placeholder="请输入占地面积" />
          </Form.Item>
          <Form.Item name="progress" label="项目进度" rules={[{ required: true, message: '请输入项目进度' }]}>
            <Input placeholder="请输入项目进度" />
          </Form.Item>
          <Form.Item name="difficulties" label="困难问题">
            <Input.TextArea rows={4} placeholder="请输入困难问题" />
          </Form.Item>
          <Form.Item name="leaderId" label="负责人ID">
            <Input type="number" placeholder="请输入负责人ID" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
