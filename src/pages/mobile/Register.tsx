import React, { useState } from 'react';
import { NavBar, Form, Input, Button, Selector, Toast, DatePicker, Picker } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const onFinish = (values: any) => {
    Toast.show({
      icon: 'success',
      content: '人员信息登记成功',
    });
    setTimeout(() => {
      navigate(-1);
    }, 1000);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavBar onBack={() => navigate(-1)} className="bg-white border-b">
        新增人员登记
      </NavBar>
      <div className="flex-1 overflow-auto">
        <Form
          form={form}
          onFinish={onFinish}
          footer={
            <Button block type="submit" color="primary" size="large">
              提交登记
            </Button>
          }
        >
          <Form.Header>基本信息</Form.Header>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
            <Input placeholder="请输入手机号" type="phone" />
          </Form.Item>
          <Form.Item name="address" label="居住地址" rules={[{ required: true }]}>
            <Input placeholder="例如: 新华村-1组-001号" />
          </Form.Item>
          
          <Form.Header>人员标签 (多选)</Form.Header>
          <Form.Item name="tags" rules={[{ required: true }]}>
            <Selector
              columns={3}
              multiple
              options={[
                { label: '返乡人员', value: '返乡人员' },
                { label: '留守老人', value: '留守老人' },
                { label: '留守儿童', value: '留守儿童' },
                { label: '外来租客', value: '外来租客' },
                { label: '退役军人', value: '退役军人' },
                { label: '低保户', value: '低保户' },
              ]}
            />
          </Form.Item>
          
          <Form.Header>补充信息</Form.Header>
          <Form.Item name="health" label="健康状况">
            <Selector
              columns={3}
              options={[
                { label: '健康', value: '健康' },
                { label: '慢性病', value: '慢性病' },
                { label: '失能', value: '失能' },
              ]}
            />
          </Form.Item>
          <Form.Item name="guardian" label="监护人/紧急联系人">
            <Input placeholder="请输入联系人姓名及电话" />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
