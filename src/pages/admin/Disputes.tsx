import React, { useState } from 'react';
import { Table, Button, Space, Input, Card, Modal, Form, Select, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, AlertOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function Disputes() {
  const { disputeRecords, addDisputeRecord, updateDisputeRecord, deleteDisputeRecord } = useStore();
  const [searchText, setSearchText] = useState('');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({}); // requested requirement
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDisputeRecord(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (values.mediatorId) {
        values.mediatorId = Number(values.mediatorId);
      }
      if (editingId) {
        await updateDisputeRecord(editingId, values);
        message.success('更新成功');
      } else {
        await addDisputeRecord(values);
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
    { title: '标题', dataIndex: 'title', key: 'title', width: 200 },
    { title: '类型', dataIndex: 'type', key: 'type', width: 150 },
    { title: '内容', dataIndex: 'content', key: 'content', width: 300 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
    { title: '调解员ID', dataIndex: 'mediatorId', key: 'mediatorId', width: 120 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 180 },
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

  const filteredData = disputeRecords.filter(item => 
    (item.title && item.title.includes(searchText)) || 
    (item.type && item.type.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <AlertOutlined className="mr-2" />
          矛盾纠纷台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索标题/地址"
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
        title={editingId ? '编辑纠纷记录' : '新增纠纷记录'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true, message: '请输入类型' }]}>
            <Input placeholder="请输入类型" />
          </Form.Item>
          <Form.Item name="content" label="内容" rules={[{ required: true, message: '请输入内容' }]}>
            <Input.TextArea rows={4} placeholder="请输入内容" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select placeholder="请选择状态" allowClear>
              <Select.Option value="待处理">待处理</Select.Option>
              <Select.Option value="处理中">处理中</Select.Option>
              <Select.Option value="已解决">已解决</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="mediatorId" label="调解员ID">
            <Input type="number" placeholder="请输入调解员ID" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
