import React, { useEffect, useState } from 'react';
import { Table, Card, Button, message, Tag, Space, Input, Modal, Form, Select, Popconfirm } from 'antd';
import { DownloadOutlined, HomeOutlined, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useStore, House as HouseType } from '../../store';

export default function House() {
  const { houses, addresses, loading, fetchHouses, fetchAddresses, addHouse, updateHouse, deleteHouse } = useStore();
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingHouse, setEditingHouse] = useState<HouseType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchHouses();
    fetchAddresses();
  }, []);

  const handleAdd = () => {
    setEditingHouse(null);
    form.resetFields();
    form.setFieldsValue({});
    form.setFieldsValue({ status: '自建房', usage: '自住' });
    setIsModalVisible(true);
  };

  const handleEdit = (record: HouseType) => {
    setEditingHouse(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteHouse(id);
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
      if (editingHouse) {
        await updateHouse(editingHouse.id, values);
        message.success('更新成功');
      } else {
        await addHouse(values);
        message.success('新增成功');
      }
      setIsModalVisible(false);
    } catch (error) {
      console.error('API call failed:', error);
      message.error('操作失败，请重试');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { title: '房屋编号', dataIndex: 'id', key: 'id', width: 100 },
    { 
      title: '房屋状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 150,
      render: (status: string) => {
        let color = 'green';
        if (status?.includes('危房')) color = 'red';
        if (status?.includes('空心房')) color = 'orange';
        if (status?.includes('民宿') || status?.includes('农家乐')) color = 'purple';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    { title: '房屋用途', dataIndex: 'usage', key: 'usage', width: 120 },
    { title: '产权人', dataIndex: 'ownerName', key: 'ownerName', width: 120 },
    { title: '产权人电话', dataIndex: 'ownerPhone', key: 'ownerPhone', width: 150 },
    { 
      title: '挂载地址', 
      dataIndex: 'addressId', 
      key: 'addressId', 
      width: 250,
      render: (addressId: string) => {
        const address = addresses.find(a => a.id === addressId);
        return address ? `${address.name} (${addressId})` : addressId;
      }
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: HouseType) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
            className="text-blue-600"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该房屋信息吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = houses.filter(item => 
    item.addressId?.includes(searchText) || 
    item.status?.includes(searchText) || 
    (item.ownerName && item.ownerName.includes(searchText))
  );

  return (
    <Card 
      className="shadow-sm"
      title={
        <span className="text-lg font-bold">
          <HomeOutlined className="mr-2" />
          实有房屋台账
        </span>
      }
      extra={
        <Space>
          <Input
            placeholder="搜索地址/状态/产权人"
            prefix={<SearchOutlined />}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增房屋</Button>
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

      <Modal
        title={editingHouse ? '编辑房屋信息' : '新增房屋'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="addressId"
            label="挂载地址"
            rules={[{ required: true, message: '请选择挂载地址' }]}
          >
            <Select
              showSearch
              placeholder="请选择地址"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={addresses.map(addr => ({
                label: `${addr.name} (${addr.id})`,
                value: addr.id
              }))}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="房屋状态"
            rules={[{ required: true, message: '请选择房屋状态' }]}
          >
            <Select placeholder="请选择房屋状态">
              <Select.Option value="自建房">自建房</Select.Option>
              <Select.Option value="商品房">商品房</Select.Option>
              <Select.Option value="危房">危房</Select.Option>
              <Select.Option value="空心房">空心房</Select.Option>
              <Select.Option value="民宿">民宿</Select.Option>
              <Select.Option value="农家乐">农家乐</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="usage"
            label="房屋用途"
          >
            <Select placeholder="请选择房屋用途">
              <Select.Option value="自住">自住</Select.Option>
              <Select.Option value="出租">出租</Select.Option>
              <Select.Option value="商用">商用</Select.Option>
              <Select.Option value="闲置">闲置</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="ownerName"
            label="产权人姓名"
          >
            <Input placeholder="请输入产权人姓名" />
          </Form.Item>

          <Form.Item
            name="ownerPhone"
            label="产权人电话"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
            ]}
          >
            <Input placeholder="请输入产权人电话" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
