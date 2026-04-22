const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const API_URL = 'http://localhost:3000/api';
const prisma = new PrismaClient();

async function seedTestData() {
  console.log('--- 开始批量生成并测试5个模块的数据 ---');

  // 确保有User存在
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({ data: { name: '测试调解员', role: '网格员' } });
  }
  const mediatorId = user.id;

  // 1. DisputeRecords
  console.log('\\n[1] 生成 DisputeRecords...');
  const disputes = [
    { title: '邻里噪音纠纷', type: '邻里', content: '二楼装修噪音', status: '待处理', mediatorId },
    { title: '宅基地边界纠纷', type: '土地', content: '两家院墙越界', status: '处理中', mediatorId },
    { title: '家庭财产纠纷', type: '家庭', content: '赡养费分配不均', status: '已解决', mediatorId },
    { title: '劳资纠纷', type: '劳务', content: '果园务工欠薪', status: '处理中', mediatorId },
    { title: '物业费纠纷', type: '物业', content: '未交卫生费', status: '待处理', mediatorId }
  ];
  let createdDisputes = [];
  for (const d of disputes) {
    const res = await axios.post(`${API_URL}/disputeRecords`, d);
    createdDisputes.push(res.data);
  }
  console.log(`成功生成 ${createdDisputes.length} 条纠纷数据。`);

  // 更新第1条，删除最后1条
  await axios.put(`${API_URL}/disputeRecords/${createdDisputes[0].id}`, { status: '已解决' });
  console.log(`更新纠纷[${createdDisputes[0].id}] 状态为已解决`);
  await axios.delete(`${API_URL}/disputeRecords/${createdDisputes[4].id}`);
  console.log(`删除纠纷[${createdDisputes[4].id}]`);


  // 2. Projects
  console.log('\\n[2] 生成 Projects...');
  const projects = [
    { name: '村道硬化工程', investment: 500000, area: 1200, progress: '施工中', difficulties: '雨季延误' },
    { name: '党群服务中心改造', investment: 300000, area: 400, progress: '前期准备', difficulties: '资金未到位' },
    { name: '河道清淤项目', investment: 150000, area: 800, progress: '已完成', difficulties: '无' },
    { name: '路灯亮化工程', investment: 80000, area: 0, progress: '施工中', difficulties: '无' },
    { name: '污水管网建设', investment: 1200000, area: 2500, progress: '已延期', difficulties: '村民阻工' }
  ];
  let createdProjects = [];
  for (const p of projects) {
    const res = await axios.post(`${API_URL}/projects`, p);
    createdProjects.push(res.data);
  }
  console.log(`成功生成 ${createdProjects.length} 条工程数据。`);

  // 更新第2条，删除第4条
  await axios.put(`${API_URL}/projects/${createdProjects[1].id}`, { progress: '施工中', investment: 350000 });
  console.log(`更新项目[${createdProjects[1].id}]`);
  await axios.delete(`${API_URL}/projects/${createdProjects[3].id}`);
  console.log(`删除项目[${createdProjects[3].id}]`);


  // 3. FloatingRecords
  console.log('\\n[3] 生成 FloatingRecords...');
  // 确保有基础数据
  let pops = (await axios.get(`${API_URL}/populations`)).data;
  let houses = (await axios.get(`${API_URL}/houses`)).data;
  if (pops.length < 5 || houses.length < 3) {
     console.log('基础人口或房屋数据不足，正在补充基础数据...');
     // 为了确保外键存在，补齐基础数据
     const dummyAddr = (await axios.post(`${API_URL}/addresses`, { id: `tmp-addr-${Date.now()}`, name: '临时地址', longitude: 113, latitude: 23 })).data;
     for(let i=0; i<5; i++) {
        await axios.post(`${API_URL}/populations`, { name: `流动测试人${i}`, addressId: dummyAddr.id });
     }
     for(let i=0; i<3; i++) {
        await axios.post(`${API_URL}/houses`, { status: '正常', addressId: dummyAddr.id });
     }
     pops = (await axios.get(`${API_URL}/populations`)).data;
     houses = (await axios.get(`${API_URL}/houses`)).data;
  }
  
  const floatings = [
    { populationId: pops[0].id, houseId: houses[0].id, origin: '外省', reason: '务工', expireDate: '2026-12-31T00:00:00Z' },
    { populationId: pops[1].id, houseId: houses[0].id, origin: '本省外市', reason: '探亲', expireDate: '2026-06-30T00:00:00Z' },
    { populationId: pops[2].id, houseId: houses[1].id, origin: '外省', reason: '经商', expireDate: '2027-01-01T00:00:00Z' },
    { populationId: pops[3].id, houseId: houses[1].id, origin: '外省', reason: '务工', expireDate: '2026-10-15T00:00:00Z' },
    { populationId: pops[4].id, houseId: houses[2].id, origin: '本省外市', reason: '就学', expireDate: '2028-07-01T00:00:00Z' }
  ];
  let createdFloatings = [];
  for (const f of floatings) {
    const res = await axios.post(`${API_URL}/floatingRecords`, f);
    createdFloatings.push(res.data);
  }
  console.log(`成功生成 ${createdFloatings.length} 条流动人口数据。`);

  // 更新第3条，删除第5条
  await axios.put(`${API_URL}/floatingRecords/${createdFloatings[2].id}`, { reason: '务工' });
  console.log(`更新流动人口[${createdFloatings[2].id}]`);
  await axios.delete(`${API_URL}/floatingRecords/${createdFloatings[4].id}`);
  console.log(`删除流动人口[${createdFloatings[4].id}]`);


  // 4. HouseInspections
  console.log('\\n[4] 生成 HouseInspections...');
  const inspections = [
    { houseId: houses[0].id, structure: '砖混', usage: '出租', hazards: '电线私拉乱接', status: '需整改', deadline: '2026-05-01T00:00:00Z' },
    { houseId: houses[1].id, structure: '钢混', usage: '自住', hazards: '无', status: '正常' },
    { houseId: houses[2].id, structure: '土木', usage: '空置', hazards: '墙体开裂', status: '存在隐患' },
    { houseId: houses[0].id, structure: '砖混', usage: '经营', hazards: '消防器材缺失', status: '需整改', deadline: '2026-04-30T00:00:00Z' },
    { houseId: houses[1].id, structure: '钢混', usage: '出租', hazards: '群租房隔断', status: '需整改', deadline: '2026-05-15T00:00:00Z' }
  ];
  let createdInspections = [];
  for (const i of inspections) {
    const res = await axios.post(`${API_URL}/houseInspections`, i);
    createdInspections.push(res.data);
  }
  console.log(`成功生成 ${createdInspections.length} 条房屋巡查数据。`);

  // 更新第1条，删除第2条
  await axios.put(`${API_URL}/houseInspections/${createdInspections[0].id}`, { status: '正常', hazards: '已修复' });
  console.log(`更新房屋巡查[${createdInspections[0].id}]`);
  await axios.delete(`${API_URL}/houseInspections/${createdInspections[1].id}`);
  console.log(`删除房屋巡查[${createdInspections[1].id}]`);


  // 5. SupervisionTasks
  console.log('\\n[5] 生成 SupervisionTasks...');
  const tasks = [
    { source: '市综治办', content: '春季防火专项督查', deadline: '2026-04-30T00:00:00Z', status: '进行中', handlerId: mediatorId },
    { source: '镇党委', content: '矛盾纠纷排查化解', deadline: '2026-05-15T00:00:00Z', status: '未开始', handlerId: mediatorId },
    { source: '村民举报', content: '违建牛棚拆除督导', deadline: '2026-04-25T00:00:00Z', status: '进行中', handlerId: mediatorId },
    { source: '网格上报', content: '流动人口信息核采', deadline: '2026-04-28T00:00:00Z', status: '已完成', handlerId: mediatorId },
    { source: '镇政府', content: '防汛物资储备检查', deadline: '2026-05-01T00:00:00Z', status: '未开始', handlerId: mediatorId }
  ];
  let createdTasks = [];
  for (const t of tasks) {
    const res = await axios.post(`${API_URL}/supervisionTasks`, t);
    createdTasks.push(res.data);
  }
  console.log(`成功生成 ${createdTasks.length} 条督导任务数据。`);

  // 更新第2条，删除第5条
  await axios.put(`${API_URL}/supervisionTasks/${createdTasks[1].id}`, { status: '进行中', report: '已开展第一轮排查' });
  console.log(`更新督导任务[${createdTasks[1].id}]`);
  await axios.delete(`${API_URL}/supervisionTasks/${createdTasks[4].id}`);
  console.log(`删除督导任务[${createdTasks[4].id}]`);

  console.log('\\n--- 所有后端数据测试完成 ---');
}

seedTestData().catch(console.error);
