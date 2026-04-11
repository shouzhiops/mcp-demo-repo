import React, { useState } from 'react';
import { NavBar, Form, Input, Button, ImageUploader, Selector, Toast, TextArea } from 'antd-mobile';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

export default function Report() {
  const navigate = useNavigate();
  const addOrder = useStore(state => state.addOrder);
  const addresses = useStore(state => state.addresses);
  
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);

  const mockUpload = async (file: File) => {
    return {
      url: URL.createObjectURL(file),
    };
  };

  const onFinish = (values: any) => {
    if (!values.type || values.type.length === 0) {
      Toast.show('请选择问题类型');
      return;
    }
    if (!values.addressId) {
      Toast.show('请获取位置信息');
      return;
    }

    addOrder({
      type: values.type[0],
      status: '待分拨',
      addressId: values.addressId,
      description: values.description,
      images: fileList.map(item => item.url)
    });

    Toast.show({
      icon: 'success',
      content: '上报成功',
    });
    
    setTimeout(() => {
      navigate(-1);
    }, 1500);
  };

  const handleGetLocation = () => {
    const randomAddress = addresses[Math.floor(Math.random() * addresses.length)];
    form.setFieldsValue({ addressId: randomAddress.id });
    Toast.show('已获取当前位置');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <NavBar onBack={() => navigate(-1)} className="bg-white sticky top-0 z-10">
        随手拍
      </NavBar>
      
      <Form
        form={form}
        onFinish={onFinish}
        footer={
          <Button block type="submit" color="primary" size="large" className="rounded-lg">
            提交上报
          </Button>
        }
      >
        <Form.Item name="images" label="现场照片">
          <ImageUploader
            value={fileList}
            onChange={setFileList}
            upload={mockUpload}
            maxCount={3}
          />
        </Form.Item>
        
        <Form.Item name="type" label="问题类型" rules={[{ required: true }]}>
          <Selector
            columns={3}
            options={[
              { label: '环境卫生', value: '环境卫生' },
              { label: '设施损坏', value: '设施损坏' },
              { label: '安全隐患', value: '安全隐患' },
              { label: '矛盾纠纷', value: '矛盾纠纷' },
              { label: '其他问题', value: '其他问题' },
            ]}
          />
        </Form.Item>
        
        <Form.Item 
          name="addressId" 
          label="位置信息" 
          rules={[{ required: true }]}
          extra={
            <div onClick={handleGetLocation} className="flex items-center text-blue-500 cursor-pointer">
              <MapPin className="w-4 h-4 mr-1" />
              定位
            </div>
          }
        >
          <Input placeholder="点击右侧按钮获取位置" readOnly />
        </Form.Item>

        <Form.Item name="description" label="问题描述">
          <TextArea
            placeholder="请输入详细描述以便我们更快处理..."
            maxLength={200}
            rows={4}
            showCount
          />
        </Form.Item>
      </Form>
    </div>
  );
}
