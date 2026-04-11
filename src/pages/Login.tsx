import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { User, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const login = useStore((state) => state.login);

  const onFinish = async (values: any) => {
    try {
      await login(values);
      message.success('登录成功');
      navigate('/admin');
    } catch (error: any) {
      message.error(error.response?.data?.error || '登录失败');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card title="系统登录" className="w-full max-w-md shadow-lg">
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input prefix={<User size={18} />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password prefix={<Lock size={18} />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" block>
              登录
            </Button>
          </Form.Item>
          <div className="text-center">
            还没有账号？ <Link to="/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
