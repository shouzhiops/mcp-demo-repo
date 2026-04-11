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

  // Addresses
  const a1 = await prisma.address.create({
    data: { id: '新华村-1组-001号', name: '张三家', longitude: 116.4, latitude: 39.9 }
  })
  const a2 = await prisma.address.create({
    data: { id: '新华村-2组-002号', name: '村口水库', longitude: 116.41, latitude: 39.91 }
  })
  const a3 = await prisma.address.create({
    data: { id: '新华村-3组-015号', name: '李四家', longitude: 116.42, latitude: 39.92 }
  })

  // Population
  await prisma.population.create({
    data: { name: '张三', type: '外出务工', phone: '13800000001', addressId: a1.id }
  })
  await prisma.population.create({
    data: { name: '张大爷', type: '留守老人', phone: '13800000002', addressId: a1.id }
  })
  await prisma.population.create({
    data: { name: '李四', type: '退役军人', phone: '13800000003', addressId: a3.id }
  })

  // House
  await prisma.house.create({
    data: { status: '危房', addressId: a1.id }
  })
  await prisma.house.create({
    data: { status: '自建房自住', addressId: a3.id }
  })

  // Unit
  await prisma.unit.create({
    data: { name: '新华小卖部', addressId: a3.id }
  })

  // Facility
  await prisma.facility.create({
    data: { type: '变压器', addressId: a2.id }
  })

  // Orders
  await prisma.order.create({
    data: {
      type: '危房裂缝',
      status: '待分拨',
      addressId: a1.id,
      description: '房屋后墙出现明显裂缝'
    }
  })
  await prisma.order.create({
    data: {
      type: '防溺水牌倾倒',
      status: '待处置',
      addressId: a2.id,
      handlerId: 101,
      description: '水库边的防溺水警示牌被风刮倒'
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
