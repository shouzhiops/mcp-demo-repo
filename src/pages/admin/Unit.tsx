import React, { useEffect, useState } from 'react';
import { Table, Card, Button, message, Tag, Space, Input, Modal, Form, Select, Popconfirm } from 'antd';
import { DownloadOutlined, ShopOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useStore, Unit as UnitType } from '../../store';

export default function Unit() {
  const { units, loading, fetchUnits, addUnit, updateUnit, deleteUnit, addresses, fetchAddresses } = useStore();
  const [searchText, setSearchText] = useState('');
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUnits();
    fetchAddresses();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({});
    setIsModalVisible(true);
  };

  const handleEdit = (record: UnitType) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteUnit(id);
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
      console.error('Validate Failed:', error);
      return;
    }

    try {
      if (editingId) {
        await updateUnit(editingId, values);
        message.success('更新成功');
      } else {
        await addUnit(values);
        message.success('添加成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('API call failed:', error);
      message.error('操作失败，请重试');
    }
  };

  const columns = [
    { title: '单位编号', dataIndex: 'id', key: 'id', width: 100 },
    { title: '单位名称', dataIndex: 'name', key: 'name', width: 250 },
    { 
      title: '单位类型', 
      dataIndex: 'type', 
      key: 'type',
      width: 150,
      render: (type: string) => {
        let color = 'cyan';
        if (type?.includes('餐饮') || type?.includes('住宿')) color = 'orange';
        if (type?.includes('机关') || type?.includes('服务')) color = 'blue';
        if (type?.includes('制造') || type?.includes('加工')) color = 'purple';
        return <Tag color={color}>{type || '未分类'}</Tag>;
      },
    },
    { title: '法定代表人', dataIndex: 'legalPerson', key: 'legalPerson', width: 120 },
    { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 150 },
    { title: '标准地址', dataIndex: 'addressId', key: 'addressId', width: 250 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: UnitType) => (
        <Space size="middle">
          <a className="text-blue-600" onClick={() => handleEdit(record)}>编辑</a>
          <Popconfirm
            title="确定要删除吗？"
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

  const handleExport = () => {
    message.success('实有单位台账导出成功！(模拟)');
  };

  const filteredData = units.filter(item => 
    (item.name && item.name.includes(searchText)) || 
    (item.addressId && item.addressId.includes(searchText)) || 
    (item.legalPerson && item.legalPerson.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <ShopOutlined className="mr-2" />
          实有单位台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索名称/地址/法人"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增单位</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
        </Space>
      }
    >
      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id"
        scroll={{ x: 'max-content' }}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingId ? '编辑单位' : '新增单位'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="单位名称"
            rules={[{ required: true, message: '请输入单位名称' }]}
          >
            <Input placeholder="请输入单位名称" />
          </Form.Item>
          <Form.Item
            name="type"
            label="单位类型"
          >
            <Select placeholder="请选择单位类型">
              <Select.Option value="特色餐饮">特色餐饮</Select.Option>
              <Select.Option value="住宿服务">住宿服务</Select.Option>
              <Select.Option value="加工制造">加工制造</Select.Option>
              <Select.Option value="机关企事业">机关企事业</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="legalPerson"
            label="法定代表人/负责人"
          >
            <Input placeholder="请输入法定代表人/负责人" />
          </Form.Item>
          <Form.Item
            name="contactPhone"
            label="联系电话"
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>
          <Form.Item
            name="addressId"
            label="关联标准地址"
            rules={[{ required: true, message: '请选择标准地址' }]}
          >
            <Select placeholder="请选择标准地址" showSearch>
              {addresses.map(addr => (
                <Select.Option key={addr.id} value={addr.id}>
                  {addr.id} ({addr.name})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
