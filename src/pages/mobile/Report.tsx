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
    <div className="bg-gray-100 min-h-screen pb-10 font-sans">
      <NavBar 
        onBack={() => navigate(-1)} 
        className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200/50"
      >
        <span className="font-semibold text-lg tracking-wide">随手拍</span>
      </NavBar>
      
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <Form
            form={form}
            onFinish={onFinish}
            layout="horizontal"
            className="px-2"
          >
            <Form.Item name="images" label="现场照片" className="border-b border-gray-100 last:border-0">
              <ImageUploader
                value={fileList}
                onChange={setFileList}
                upload={mockUpload}
                maxCount={3}
              />
            </Form.Item>
            
            <Form.Item name="type" label="问题类型" rules={[{ required: true }]} className="border-b border-gray-100 last:border-0">
              <Selector
                columns={3}
                options={[
                  { label: '环境卫生', value: '环境卫生' },
                  { label: '设施损坏', value: '设施损坏' },
                  { label: '安全隐患', value: '安全隐患' },
                  { label: '矛盾纠纷', value: '矛盾纠纷' },
                  { label: '其他问题', value: '其他问题' },
                ]}
                className="my-2"
              />
            </Form.Item>
            
            <Form.Item 
              name="addressId" 
              label="位置信息" 
              rules={[{ required: true }]}
              className="border-b border-gray-100 last:border-0"
              extra={
                <div onClick={handleGetLocation} className="flex items-center text-blue-500 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium transition-colors active:bg-blue-100">
                  <MapPin className="w-4 h-4 mr-1" />
                  定位
                </div>
              }
            >
              <Input placeholder="点击右侧按钮获取位置" readOnly className="text-gray-700" />
            </Form.Item>

            <Form.Item name="description" label="问题描述" className="border-b border-gray-100 last:border-0">
              <TextArea
                placeholder="请输入详细描述以便我们更快处理..."
                maxLength={200}
                rows={4}
                showCount
                className="bg-gray-50 p-3 rounded-xl mt-2 text-gray-700"
              />
            </Form.Item>
          </Form>
        </div>

        <Button 
          block 
          type="submit" 
          color="primary" 
          size="large" 
          className="rounded-2xl shadow-md font-medium text-lg h-12"
          onClick={() => form.submit()}
        >
          提交上报
        </Button>
      </div>
    </div>
  );
}
