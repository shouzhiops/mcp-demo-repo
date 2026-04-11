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
    if (!navigator.geolocation) {
      Toast.show('浏览器不支持地理定位');
      return;
    }

    Toast.show({
      icon: 'loading',
      content: '获取位置中...',
      duration: 0,
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        if (addresses.length > 0) {
          // 找到最近的地址
          let closest = addresses[0];
          let minDistance = Number.MAX_VALUE;
          
          addresses.forEach(addr => {
            const dx = addr.longitude - longitude;
            const dy = addr.latitude - latitude;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < minDistance) {
              minDistance = distance;
              closest = addr;
            }
          });

          form.setFieldsValue({ addressId: closest.id });
          Toast.clear();
          Toast.show('已获取当前位置');
        } else {
          Toast.clear();
          Toast.show('未找到可用地址');
        }
      },
      (error) => {
        Toast.clear();
        Toast.show('获取位置失败');
        console.error(error);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10 font-sans">
      <NavBar 
        onBack={() => navigate(-1)} 
        className="backdrop-blur-md bg-white/70 sticky top-0 z-10 border-b border-gray-200/50"
      >
        <span className="font-semibold text-lg tracking-wide">随手拍</span>
      </NavBar>
      
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            className="px-2"
            style={{ '--border-top': 'none', '--border-bottom': 'none', '--border-inner': 'none' } as any}
          >
            <Form.Item name="images" label="现场照片" className="mb-2">
              <ImageUploader
                value={fileList}
                onChange={setFileList}
                upload={mockUpload}
                maxCount={3}
              />
            </Form.Item>
            
            <Form.Item name="type" label="问题类型" rules={[{ required: true }]} className="mb-2">
              <Selector
                columns={3}
                options={[
                  { label: '环境卫生', value: '环境卫生' },
                  { label: '设施损坏', value: '设施损坏' },
                  { label: '安全隐患', value: '安全隐患' },
                  { label: '矛盾纠纷', value: '矛盾纠纷' },
                  { label: '其他问题', value: '其他问题' },
                ]}
                className="mt-2"
              />
            </Form.Item>
            
            <Form.Item 
              name="addressId" 
              label="位置信息" 
              rules={[{ required: true }]}
              className="mb-2"
              extra={
                <div onClick={handleGetLocation} className="flex items-center text-blue-500 cursor-pointer bg-blue-50 px-3 py-1.5 rounded-full text-sm font-medium transition-colors active:bg-blue-100">
                  <MapPin className="w-4 h-4 mr-1" />
                  定位
                </div>
              }
            >
              <Input placeholder="点击右侧按钮获取位置" readOnly className="bg-gray-50 p-3 rounded-xl mt-2 text-gray-700" />
            </Form.Item>

            <Form.Item name="description" label="问题描述" className="mb-2">
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
