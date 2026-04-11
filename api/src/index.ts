import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 获取所有地址数据
app.get('/api/addresses', async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      include: {
        populations: true,
        houses: true,
        units: true,
        facilities: true,
        orders: true,
      }
    });
    res.json(addresses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// 获取所有人口数据
app.get('/api/populations', async (req, res) => {
  try {
    const populations = await prisma.population.findMany({
      include: {
        address: true
      }
    });
    res.json(populations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch populations' });
  }
});

// 获取所有房屋数据
app.get('/api/houses', async (req, res) => {
  try {
    const houses = await prisma.house.findMany({
      include: {
        address: {
          include: {
            populations: true
          }
        }
      }
    });
    res.json(houses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch houses' });
  }
});

// 获取所有单位数据
app.get('/api/units', async (req, res) => {
  try {
    const units = await prisma.unit.findMany({
      include: {
        address: true
      }
    });
    res.json(units);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch units' });
  }
});

// 获取所有设施数据
app.get('/api/facilities', async (req, res) => {
  try {
    const facilities = await prisma.facility.findMany({
      include: {
        address: true
      }
    });
    res.json(facilities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
});

// 获取所有工单数据
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        address: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// 创建工单
app.post('/api/orders', async (req, res) => {
  try {
    const { type, addressId, description, status = '待分拨' } = req.body;
    const newOrder = await prisma.order.create({
      data: {
        type,
        addressId,
        description,
        status,
      }
    });
    res.json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// 更新工单状态
app.patch('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, handlerId } = req.body;
    const updatedOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        status,
        ...(handlerId !== undefined && { handlerId })
      }
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
