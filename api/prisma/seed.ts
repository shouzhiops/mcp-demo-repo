import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 随机生成函数工具
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomOffset = (base: number, range: number) => base + (Math.random() - 0.5) * range;

// 莲麻村基准数据
const CENTER_LNG = 113.89;
const CENTER_LAT = 23.85;
const GROUPS = [
  { name: '中田组', surname: '黄', count: 60 },
  { name: '白石组', surname: '李', count: 50 },
  { name: '瓦坑组', surname: '张', count: 40 },
  { name: '上田组', surname: '陈', count: 30 },
  { name: '下田组', surname: '林', count: 20 },
];

const POPULATION_TYPES = [
  { type: '常住村民', weight: 40 },
  { type: '外出务工', weight: 25 },
  { type: '留守老人', weight: 15 },
  { type: '留守儿童', weight: 10 },
  { type: '外来租客', weight: 5 },
  { type: '退役军人', weight: 3 },
  { type: '村干部', weight: 2 },
];

const HOUSE_STATUSES = [
  { status: '自建房自住', weight: 70 },
  { status: '特色民宿(经营)', weight: 15 },
  { status: '农家乐用房', weight: 8 },
  { status: '长期空心房', weight: 5 },
  { status: 'C级危房', weight: 2 },
];

const FIRST_NAMES = ['建国', '大牛', '小明', '丫丫', '伟', '芳', '娜', '敏', '静', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀英', '霞', '平', '刚', '桂英'];

// 根据权重随机选择
function getByWeight<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    if (random < item.weight) return item;
    random -= item.weight;
  }
  return items[0];
}

async function main() {
  console.log('Seeding large-scale realistic database for Lianma Village...')
  
  // 1. Clear existing data
  await prisma.order.deleteMany()
  await prisma.population.deleteMany()
  await prisma.house.deleteMany()
  await prisma.unit.deleteMany()
  await prisma.facility.deleteMany()
  await prisma.address.deleteMany()
  await prisma.config.deleteMany()

  // Config
  await prisma.config.create({
    data: { id: 1, tiandituKey: '' }
  })

  const addresses: any[] = [];
  const populations: any[] = [];
  const houses: any[] = [];
  const units: any[] = [];
  const facilities: any[] = [];
  const orders: any[] = [];

  // 2. 生成地址与挂载实体
  for (const group of GROUPS) {
    for (let i = 1; i <= group.count; i++) {
      const addressId = `莲麻村-${group.name}-${String(i).padStart(3, '0')}号`;
      const isPublicArea = Math.random() > 0.95; // 5% 概率是公共区域（如广场、路口）
      
      const lng = randomOffset(CENTER_LNG, 0.015); // 约 1.5km 范围
      const lat = randomOffset(CENTER_LAT, 0.015);
      
      addresses.push({
        id: addressId,
        name: isPublicArea ? `${group.name}公共区域` : `${group.surname}姓村民宅基地`,
        longitude: lng,
        latitude: lat
      });

      if (!isPublicArea) {
        // --- 房屋 ---
        const houseStatus = getByWeight(HOUSE_STATUSES).status;
        houses.push({ status: houseStatus, addressId });

        // --- 人口 ---
        // 每户随机 1~6 人
        const familySize = randomInt(1, 6);
        let hasHead = false;
        
        for (let j = 0; j < familySize; j++) {
          const isHead = !hasHead;
          if (isHead) hasHead = true;
          
          let popType = isHead ? '常住村民' : getByWeight(POPULATION_TYPES).type;
          
          populations.push({
            name: `${group.surname}${randomElement(FIRST_NAMES)}`,
            type: popType,
            phone: `13${randomInt(100000000, 999999999)}`,
            addressId
          });
        }

        // --- 单位 (部分民宿和农家乐生成实体) ---
        if (houseStatus === '特色民宿(经营)') {
          units.push({ name: `莲麻${group.surname}家特色民宿`, addressId });
        } else if (houseStatus === '农家乐用房') {
          units.push({ name: `莲麻原生态农家乐(${group.name})`, addressId });
        } else if (Math.random() > 0.98) {
          units.push({ name: `${group.surname}记头酒酿造坊`, addressId });
        }
      } else {
        // 公共区域生成设施
        const facilityTypes = ['雪亮工程监控球机', '微型消防站', '垃圾分类收集亭', '防溺水警示牌', '村级水泵房'];
        facilities.push({ type: randomElement(facilityTypes), addressId });
      }

      // --- 隐患工单 ---
      // 大约 10% 的地址有历史或现有工单
      if (Math.random() > 0.9) {
        const orderTypes = ['环境卫生', '矛盾纠纷', '消防隐患', '危房排查', '治安维稳', '设施损坏'];
        const statuses = ['待分拨', '待处置', '已处置', '已销账'];
        
        // 随机生成过去 30 天内的时间
        const daysAgo = randomInt(0, 30);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);
        
        const status = randomElement(statuses);
        
        orders.push({
          type: randomElement(orderTypes),
          status: status,
          addressId,
          description: `网格员巡查发现位于${addressId}的隐患情况，需及时跟进处理。`,
          createdAt: createdAt,
          updatedAt: status === '待分拨' ? createdAt : new Date()
        });
      }
    }
  }

  // 额外添加几个固定的重要村级单位
  const centerAddressId = '莲麻村-村委大院-001号';
  addresses.push({ id: centerAddressId, name: '莲麻村党群服务中心', longitude: CENTER_LNG, latitude: CENTER_LAT });
  units.push({ name: '莲麻村村民委员会', addressId: centerAddressId });
  units.push({ name: '莲麻小镇游客服务中心', addressId: centerAddressId });
  facilities.push({ type: '微型消防站(总站)', addressId: centerAddressId });
  populations.push({ name: '王书记', type: '村干部', phone: '13800000000', addressId: centerAddressId });

  console.log(`Prepared ${addresses.length} addresses.`);
  console.log(`Prepared ${populations.length} populations.`);
  console.log(`Prepared ${houses.length} houses.`);
  console.log(`Prepared ${units.length} units.`);
  console.log(`Prepared ${facilities.length} facilities.`);
  console.log(`Prepared ${orders.length} orders.`);

  // 3. 批量插入数据库 (使用 createMany 提升性能)
  console.log('Inserting data into database...');
  await prisma.address.createMany({ data: addresses });
  await prisma.population.createMany({ data: populations });
  await prisma.house.createMany({ data: houses });
  await prisma.unit.createMany({ data: units });
  await prisma.facility.createMany({ data: facilities });
  await prisma.order.createMany({ data: orders });

  console.log('Large-scale Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
