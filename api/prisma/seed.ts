import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  // Clear existing data
  await prisma.order.deleteMany()
  await prisma.population.deleteMany()
  await prisma.house.deleteMany()
  await prisma.unit.deleteMany()
  await prisma.facility.deleteMany()
  await prisma.address.deleteMany()

  // Addresses in Guangzhou Conghua Lianma Village (approx 23.85, 113.89)
  const a1 = await prisma.address.create({
    data: { id: '莲麻村-中田组-001号', name: '黄大伯家', longitude: 113.891, latitude: 23.851 }
  })
  const a2 = await prisma.address.create({
    data: { id: '莲麻村-中田组-002号', name: '村口广场', longitude: 113.892, latitude: 23.852 }
  })
  const a3 = await prisma.address.create({
    data: { id: '莲麻村-白石组-015号', name: '特色民宿A', longitude: 113.893, latitude: 23.850 }
  })
  const a4 = await prisma.address.create({
    data: { id: '莲麻村-白石组-018号', name: '村委办公楼', longitude: 113.890, latitude: 23.855 }
  })

  // Population
  await prisma.population.create({
    data: { name: '黄建国', type: '外出务工', phone: '13800000001', addressId: a1.id }
  })
  await prisma.population.create({
    data: { name: '黄大伯', type: '留守老人', phone: '13800000002', addressId: a1.id }
  })
  await prisma.population.create({
    data: { name: '李四', type: '退役军人', phone: '13800000003', addressId: a3.id }
  })
  await prisma.population.create({
    data: { name: '王村长', type: '村干部', phone: '13800000004', addressId: a4.id }
  })

  // House
  await prisma.house.create({
    data: { status: '危房(C级)', addressId: a1.id }
  })
  await prisma.house.create({
    data: { status: '特色民宿', addressId: a3.id }
  })
  await prisma.house.create({
    data: { status: '办公用房', addressId: a4.id }
  })

  // Unit
  await prisma.unit.create({
    data: { name: '莲麻酒业酿造厂', addressId: a2.id }
  })
  await prisma.unit.create({
    data: { name: '山水农家乐', addressId: a3.id }
  })
  await prisma.unit.create({
    data: { name: '村卫生室', addressId: a4.id }
  })

  // Facility
  await prisma.facility.create({
    data: { type: '微型消防站', addressId: a2.id }
  })
  await prisma.facility.create({
    data: { type: '雪亮工程监控球机', addressId: a4.id }
  })
  await prisma.facility.create({
    data: { type: '垃圾分类收集点', addressId: a1.id }
  })

  // Orders
  await prisma.order.create({
    data: {
      type: '危房裂缝',
      status: '待分拨',
      addressId: a1.id,
      description: '暴雨后后墙出现新裂缝，需紧急排查'
    }
  })
  await prisma.order.create({
    data: {
      type: '消防设施损坏',
      status: '待处置',
      addressId: a2.id,
      handlerId: 101,
      description: '微型消防站灭火器缺失'
    }
  })

  console.log('Seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
