export interface HouseData {
  id: string;           // 标准地址编号
  group: string;        // 所属村民小组
  owner: string;        // 房屋所有人
  area: number;         // 建筑面积
  status: '自住' | '空置' | '危房' | '出租';
  structure: string;    // 建筑结构
}

export interface PopulationData {
  name: string;         // 姓名
  gender: string;       // 性别
  age: number;          // 年龄
  idCard: string;       // 脱敏身份证号
  phone: string;        // 联系电话
  houseId: string;      // 居住地址编号
  label: '常住村民' | '外出务工' | '独居老人' | '外来人口' | '五保户' | '留守儿童' | '村干部/网格员';
  healthStatus: string; // 健康状况
}

export interface FacilityData {
  name: string;         // 名称
  category: string;     // 类别
  id: string;           // 标准地址编号
  manager: string;      // 负责人
  phone: string;        // 联系电话
  status: '正常' | '需整改' | '需清理';
  issueDesc: string;    // 隐患描述
}

export interface Incident {
  id: string;
  title: string;
  desc: string;
  status: '待处理' | '处理中' | '已结案';
  reporter: string;
  assignedTo: string;
  createTime: string;
}
