import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, message, Typography } from 'antd';
import { SettingOutlined, SaveOutlined } from '@ant-design/icons';
import { useStore } from '../../store';

const { Title, Paragraph, Text } = Typography;

export default function Settings() {
  const [form] = Form.useForm();
  const { config, fetchConfig, updateConfig } = useStore();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (config) {
      form.setFieldsValue({
        tiandituKey: config.tiandituKey || '',
      });
    }
  }, [config, form]);

  const onFinish = async (values: { tiandituKey: string }) => {
    setSaving(true);
    try {
      await updateConfig(values.tiandituKey);
      message.success('系统设置保存成功！');
    } catch (error) {
      message.error('保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card 
        title={<span className="text-lg font-bold"><SettingOutlined className="mr-2" />系统全局设置</span>}
        className="shadow-sm"
      >
        <Typography className="mb-8">
          <Title level={4}>地图底图配置 (天地图)</Title>
          <Paragraph>
            本系统的可视化指挥大屏采用国家地理信息公共服务平台（天地图）作为基础底图。为了正常显示高清的卫星影像地图，您需要在此配置您的专属 API Key。
          </Paragraph>
          <Paragraph>
            <Text type="secondary">
              获取方式：访问 <a href="https://www.tianditu.gov.cn/" target="_blank" rel="noreferrer">天地图官网</a> 注册开发者账号，并在控制台创建“浏览器端”应用以获取 Key。
            </Text>
          </Paragraph>
        </Typography>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-2xl"
        >
          <Form.Item
            label="天地图 API Key"
            name="tiandituKey"
            rules={[
              { required: true, message: '请输入天地图 API Key' },
              { min: 20, message: 'API Key 格式不正确' }
            ]}
          >
            <Input.Password 
              placeholder="请输入您的天地图浏览器端 API Key" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              icon={<SaveOutlined />}
              loading={saving}
            >
              保存配置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}