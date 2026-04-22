import React, { useState } from 'react';
import { Table, Button, Space, Input, Card, Modal, Form, Select, Popconfirm, message } from 'antd';
import { SearchOutlined, PlusOutlined, DownloadOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

export default function HouseInspections() {
  const { houseInspections, houses, addHouseInspection, updateHouseInspection, deleteHouseInspection } = useStore();
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
      if (values.houseId !== undefined) values.houseId = Number(values.houseId);

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
    { title: '房屋ID', dataIndex: 'houseId', key: 'houseId', width: 120 },
    { title: '建筑结构', dataIndex: 'structure', key: 'structure', width: 150 },
    { title: '使用情况', dataIndex: 'usage', key: 'usage', width: 150 },
    { title: '安全隐患', dataIndex: 'hazards', key: 'hazards', width: 250 },
    { title: '整改期限', dataIndex: 'deadline', key: 'deadline', width: 150 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
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
    (item.structure && item.structure.includes(searchText)) || 
    (item.hazards && item.hazards.includes(searchText))
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
            placeholder="搜索建筑结构/隐患"
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
          <Form.Item name="houseId" label="巡查房屋" rules={[{ required: true, message: '请选择巡查房屋' }]}>
            <Select placeholder="请选择巡查房屋" showSearch optionFilterProp="children" allowClear>
              {houses.map(h => (
                <Select.Option key={h.id} value={h.id}>房屋ID: {h.id}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="structure" label="建筑结构" rules={[{ required: true, message: '请输入建筑结构' }]}>
            <Input placeholder="如：砖木、钢混等" />
          </Form.Item>
          <Form.Item name="usage" label="使用情况" rules={[{ required: true, message: '请输入使用情况' }]}>
            <Input placeholder="如：自住、出租等" />
          </Form.Item>
          <Form.Item name="hazards" label="安全隐患" rules={[{ required: true, message: '请输入安全隐患' }]}>
            <Input.TextArea rows={4} placeholder="请输入安全隐患描述" />
          </Form.Item>
          <Form.Item name="deadline" label="整改期限">
            <Input type="date" placeholder="请选择整改期限" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
            <Select placeholder="请选择状态" allowClear>
              <Select.Option value="正常">正常</Select.Option>
              <Select.Option value="存在隐患">存在隐患</Select.Option>
              <Select.Option value="需整改">需整改</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
