import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database for Lianma Village...')
  
  // Clear existing data
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

  // 1. Addresses in Guangzhou Conghua Lianma Village
  // Base coordinates around [23.85, 113.89]
  const addresses = [
    // 中田组
    { id: '莲麻村-中田组-001号', name: '黄建国户', longitude: 113.8912, latitude: 23.8510 },
    { id: '莲麻村-中田组-002号', name: '莲麻酒业', longitude: 113.8920, latitude: 23.8515 },
    { id: '莲麻村-中田组-005号', name: '黄老太家', longitude: 113.8905, latitude: 23.8520 },
    { id: '莲麻村-中田组-008号', name: '村口广场', longitude: 113.8930, latitude: 23.8505 },
    // 白石组
    { id: '莲麻村-白石组-011号', name: '特色民宿A', longitude: 113.8950, latitude: 23.8490 },
    { id: '莲麻村-白石组-012号', name: '李大牛户', longitude: 113.8960, latitude: 23.8485 },
    { id: '莲麻村-白石组-018号', name: '村委办公楼', longitude: 113.8945, latitude: 23.8495 },
    { id: '莲麻村-白石组-020号', name: '顺丰代收点', longitude: 113.8940, latitude: 23.8498 },
    // 瓦坑组
    { id: '莲麻村-瓦坑组-003号', name: '农家乐老字号', longitude: 113.8880, latitude: 23.8530 },
    { id: '莲麻村-瓦坑组-007号', name: '瓦坑闲置房', longitude: 113.8875, latitude: 23.8540 },
    { id: '莲麻村-瓦坑组-010号', name: '张退伍家', longitude: 113.8890, latitude: 23.8525 },
  ];

  for (const addr of addresses) {
    await prisma.address.create({ data: addr });
  }

  // 2. Population
  const populations = [
    { name: '黄建国', type: '户主', phone: '13800000001', addressId: '莲麻村-中田组-001号' },
    { name: '黄小明', type: '外出务工', phone: '13800000002', addressId: '莲麻村-中田组-001号' },
    { name: '黄老太', type: '留守老人', phone: '13800000003', addressId: '莲麻村-中田组-005号' },
    { name: '黄丫丫', type: '留守儿童', phone: '', addressId: '莲麻村-中田组-005号' },
    { name: '李大牛', type: '户主', phone: '13800000004', addressId: '莲麻村-白石组-012号' },
    { name: '李嫂', type: '外来媳妇', phone: '13800000005', addressId: '莲麻村-白石组-012号' },
    { name: '王书记', type: '村干部', phone: '13800000006', addressId: '莲麻村-白石组-018号' },
    { name: '张网格', type: '网格员', phone: '13800000007', addressId: '莲麻村-白石组-018号' },
    { name: '张退伍', type: '退役军人', phone: '13800000008', addressId: '莲麻村-瓦坑组-010号' },
    { name: '赵老板', type: '外来租客', phone: '13800000009', addressId: '莲麻村-白石组-011号' },
  ];

  await prisma.population.createMany({ data: populations });

  // 3. Houses
  const houses = [
    { status: '自建房自住', addressId: '莲麻村-中田组-001号' },
    { status: 'C级危房', addressId: '莲麻村-中田组-005号' },
    { status: '特色民宿(经营)', addressId: '莲麻村-白石组-011号' },
    { status: '自建房自住', addressId: '莲麻村-白石组-012号' },
    { status: '办公用房', addressId: '莲麻村-白石组-018号' },
    { status: '农家乐用房', addressId: '莲麻村-瓦坑组-003号' },
    { status: '长期空心房', addressId: '莲麻村-瓦坑组-007号' },
    { status: '自建房自住', addressId: '莲麻村-瓦坑组-010号' },
  ];

  await prisma.house.createMany({ data: houses });

  // 4. Units
  const units = [
    { name: '莲麻酒业酿造厂', addressId: '莲麻村-中田组-002号' },
    { name: '莲麻小镇头酒坊', addressId: '莲麻村-白石组-011号' },
    { name: '村卫生站', addressId: '莲麻村-白石组-018号' },
    { name: '顺丰村级快递代收点', addressId: '莲麻村-白石组-020号' },
    { name: '吕田特色农家乐', addressId: '莲麻村-瓦坑组-003号' },
  ];

  await prisma.unit.createMany({ data: units });

  // 5. Facilities
  const facilities = [
    { type: '微型消防站', addressId: '莲麻村-中田组-008号' },
    { type: '垃圾分类收集亭', addressId: '莲麻村-中田组-001号' },
    { type: '雪亮工程监控球机', addressId: '莲麻村-白石组-018号' },
    { type: '村口水泵房', addressId: '莲麻村-白石组-011号' },
    { type: '防溺水警示牌', addressId: '莲麻村-瓦坑组-007号' },
  ];

  await prisma.facility.createMany({ data: facilities });

  // 6. Orders
  const orders = [
    {
      type: '危房隐患',
      status: '待分拨',
      addressId: '莲麻村-中田组-005号',
      description: '暴雨后黄老太家的后墙泥砖脱落，需要紧急转移人员并排查。'
    },
    {
      type: '消防设施损坏',
      status: '待处置',
      addressId: '莲麻村-中田组-008号',
      handlerId: 101,
      description: '广场微型消防站的干粉灭火器缺失两个。'
    },
    {
      type: '环境卫生',
      status: '已处置',
      addressId: '莲麻村-白石组-020号',
      handlerId: 102,
      description: '快递点门前堆积大量废弃纸箱，影响村容村貌。'
    },
    {
      type: '矛盾纠纷',
      status: '待分拨',
      addressId: '莲麻村-瓦坑组-003号',
      description: '农家乐因停车问题与邻居张退伍发生口角。'
    },
    {
      type: '治安隐患',
      status: '已销账',
      addressId: '莲麻村-白石组-018号',
      handlerId: 103,
      description: '村委办公楼后的监控球机离线，已联系电信公司修复。'
    },
  ];

  for (const order of orders) {
    await prisma.order.create({ data: order });
  }

  console.log('Lianma Village Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
