import React, { useEffect, useState } from 'react';
import { NavBar, Form, Input, Button, Selector, Toast, Picker } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

const HousePicker = ({ value, onChange, houses }: any) => {
  const [visible, setVisible] = useState(false);
  
  const houseOptions = houses.map((h: any) => ({
    label: `${h.address?.name || h.addressId} - 房屋#${h.id} (${h.ownerName || '未知'})`,
    value: h.id,
  }));

  const selected = houseOptions.find((o: any) => o.value === (value && value[0]));

  return (
    <>
      <div 
        onClick={() => setVisible(true)} 
        className={selected ? 'text-gray-800' : 'text-gray-400'}
      >
        {selected ? selected.label : '请选择居住房屋'}
      </div>
      <Picker
        columns={[houseOptions]}
        visible={visible}
        onClose={() => setVisible(false)}
        value={value}
        onConfirm={v => {
          onChange(v);
        }}
      />
    </>
  );
};

export default function Register() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { houses, fetchHouses, addPopulation } = useStore();
  
  useEffect(() => {
    fetchHouses();
  }, [fetchHouses]);

  const onFinish = async (values: any) => {
    try {
      const houseId = values.houseId?.[0];
      const selectedHouse = houses.find(h => h.id === houseId);
      
      const payload = {
        name: values.name,
        phone: values.phone,
        type: values.tags?.[0] || '常规人口',
        addressId: selectedHouse?.addressId || '1',
      };

      await addPopulation(payload);

      Toast.show({
        icon: 'success',
        content: '人员信息登记成功',
      });
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '提交失败，请重试',
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pb-6">
      <div className="backdrop-blur-md bg-white/70 sticky top-0 z-50 border-b border-gray-100">
        <NavBar onBack={() => navigate(-1)}>
          新增人员登记
        </NavBar>
      </div>
      
      <div className="flex-1 overflow-auto px-4 py-4 space-y-4">
        <Form
          form={form}
          onFinish={onFinish}
          layout="horizontal"
          style={{ '--border-top': 'none', '--border-bottom': 'none', '--border-inner': '1px solid #f3f4f6' }}
          footer={
            <Button block type="submit" color="primary" size="large" className="rounded-xl mt-4 border-none shadow-sm shadow-blue-200">
              提交登记
            </Button>
          }
        >
          {/* 基本信息 Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            <div className="bg-white border-b border-gray-50 text-gray-800 font-semibold px-4 py-3 text-base m-0">基本信息</div>
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
              <Input placeholder="请输入姓名" clearable />
            </Form.Item>
            <Form.Item name="phone" label="联系电话" rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的11位手机号' }
            ]}>
              <Input placeholder="请输入手机号" type="phone" clearable />
            </Form.Item>
            <Form.Item name="idCard" label="身份证号" rules={[
              { pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/, message: '请输入有效的18位身份证号' }
            ]}>
              <Input placeholder="请输入身份证号" clearable />
            </Form.Item>
          </div>

          {/* 关联房屋 Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
             <div className="bg-white border-b border-gray-50 text-gray-800 font-semibold px-4 py-3 text-base m-0">居住信息</div>
             <Form.Item 
               name="houseId" 
               label="关联房屋" 
               rules={[{ required: true, message: '请选择关联房屋' }]}
             >
               <HousePicker houses={houses} />
             </Form.Item>
          </div>
          
          {/* 人员标签 Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            <div className="bg-white border-b border-gray-50 text-gray-800 font-semibold px-4 py-3 text-base m-0">人员标签</div>
            <Form.Item name="tags" rules={[{ required: true, message: '请选择人员标签' }]}>
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
          </div>
          
          {/* 补充信息 Card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            <div className="bg-white border-b border-gray-50 text-gray-800 font-semibold px-4 py-3 text-base m-0">补充信息</div>
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
            <Form.Item name="guardian" label="紧急联系人">
              <Input placeholder="请输入联系人姓名及电话" clearable />
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}
