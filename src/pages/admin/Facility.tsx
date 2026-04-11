import React, { useEffect, useState } from 'react';
import { Table, Card, Button, message, Tag, Space, Input, Modal, Form, Select, Popconfirm } from 'antd';
import { DownloadOutlined, SafetyCertificateOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function Facility() {
  const { facilities, loading, fetchFacilities, addFacility, updateFacility, deleteFacility } = useStore();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      type: record.type ? [record.type] : [],
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFacility(id);
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const submitData = {
        ...values,
        type: Array.isArray(values.type) ? values.type[0] : values.type,
      };
      
      if (editingId) {
        await updateFacility(editingId, submitData);
        message.success('更新成功');
      } else {
        await addFacility(submitData);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('Validation Failed:', error);
    }
  };

  const columns = [
    { title: '设施编号', dataIndex: 'id', key: 'id', width: 100 },
    { title: '设施类型', dataIndex: 'type', key: 'type', width: 150 },
    { title: '设施名称', dataIndex: 'name', key: 'name', width: 200 },
    { 
      title: '运行状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 120,
      render: (status: string) => {
        let color = 'green';
        if (status === '维护中') color = 'orange';
        if (status === '损坏') color = 'red';
        return <Tag color={color}>{status || '正常'}</Tag>;
      },
    },
    { title: '管护责任人', dataIndex: 'manager', key: 'manager', width: 150 },
    { title: '标准地址', dataIndex: 'addressId', key: 'addressId', width: 250 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: (_, record: any) => (
        <Space size="middle">
          <a className="text-blue-600" onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除此设施吗？"
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

  const filteredData = facilities.filter(item => 
    item.type.includes(searchText) || item.addressId.includes(searchText) || (item.name && item.name.includes(searchText)) || (item.manager && item.manager.includes(searchText))
  );

  return (
    <>
      <Card 
        className="shadow-sm"
        title={
          <span className="text-lg font-bold">
            <SafetyCertificateOutlined className="mr-2" />
            实有设施台账
          </span>
        }
        extra={
          <Space>
            <Input
              placeholder="搜索名称/类型/责任人"
              prefix={<SearchOutlined />}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增设施</Button>
            <Button icon={<DownloadOutlined />}>导出</Button>
          </Space>
        }
      >
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id"
          loading={loading}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑设施' : '新增设施'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="type"
            label="设施类型"
            rules={[{ required: true, message: '请输入或选择设施类型' }]}
          >
            <Select mode="tags" maxCount={1} placeholder="选择或输入设施类型">
              <Select.Option value="消防">消防</Select.Option>
              <Select.Option value="监控">监控</Select.Option>
              <Select.Option value="垃圾">垃圾</Select.Option>
              <Select.Option value="交通">交通</Select.Option>
              <Select.Option value="照明">照明</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="设施名称"
            rules={[{ required: true, message: '请输入设施名称' }]}
          >
            <Input placeholder="请输入设施名称" />
          </Form.Item>
          <Form.Item
            name="status"
            label="运行状态"
            rules={[{ required: true, message: '请选择运行状态' }]}
            initialValue="正常"
          >
            <Select placeholder="请选择运行状态">
              <Select.Option value="正常">正常</Select.Option>
              <Select.Option value="维护中">维护中</Select.Option>
              <Select.Option value="损坏">损坏</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="manager"
            label="管护责任人"
          >
            <Input placeholder="请输入管护责任人姓名" />
          </Form.Item>
          <Form.Item
            name="addressId"
            label="标准地址"
            rules={[{ required: true, message: '请输入标准地址编号' }]}
          >
            <Input placeholder="请输入关联的标准地址编号（如：莲麻村-中田组-001号）" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
