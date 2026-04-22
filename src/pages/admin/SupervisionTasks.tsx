import React, { useState } from 'react';
import { Table, Button, Space, Input, Card, Modal, Form, Select, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function SupervisionTasks() {
  const { supervisionTasks, addSupervisionTask, updateSupervisionTask, deleteSupervisionTask } = useStore();
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
      await deleteSupervisionTask(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (values.handlerId !== undefined) values.handlerId = Number(values.handlerId);

      if (editingId) {
        await updateSupervisionTask(editingId, values);
        message.success('更新成功');
      } else {
        await addSupervisionTask(values);
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
    { title: '任务来源', dataIndex: 'source', key: 'source', width: 150 },
    { title: '任务内容', dataIndex: 'content', key: 'content', width: 300 },
    { title: '截止期限', dataIndex: 'deadline', key: 'deadline', width: 150 },
    { title: '处理人ID', dataIndex: 'handlerId', key: 'handlerId', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
    { title: '督导报告', dataIndex: 'report', key: 'report', width: 200 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 150,
      render: (_, record: any) => (
        <Space size="middle">
          <a className="text-blue-600" onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除该任务吗？"
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

  const filteredData = supervisionTasks.filter(item => 
    (item.source && item.source.includes(searchText)) || 
    (item.content && item.content.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <EyeOutlined className="mr-2" />
          督导任务台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索任务来源/内容"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" className="bg-gov-blue" icon={<PlusOutlined />} onClick={handleAdd}>新增任务</Button>
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
        title={editingId ? '编辑督导任务' : '新增督导任务'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="source" label="任务来源" rules={[{ required: true, message: '请输入任务来源' }]}>
            <Input placeholder="请输入任务来源" />
          </Form.Item>
          <Form.Item name="content" label="任务内容" rules={[{ required: true, message: '请输入任务内容' }]}>
            <Input.TextArea rows={4} placeholder="请输入任务内容" />
          </Form.Item>
          <Form.Item name="deadline" label="截止期限" rules={[{ required: true, message: '请选择截止期限' }]}>
            <Input type="date" placeholder="请选择截止期限" />
          </Form.Item>
          <Form.Item name="handlerId" label="处理人ID">
            <Input type="number" placeholder="请输入处理人ID" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select placeholder="请选择状态" allowClear>
              <Select.Option value="待分配">待分配</Select.Option>
              <Select.Option value="进行中">进行中</Select.Option>
              <Select.Option value="已完成">已完成</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="report" label="督导报告">
            <Input.TextArea rows={4} placeholder="请输入督导报告" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
