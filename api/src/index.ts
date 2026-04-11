import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ==================== Address API ====================
app.get('/api/addresses', async (req, res) => {
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
});

app.post('/api/addresses', async (req, res) => {
  const data = req.body;
  const address = await prisma.address.create({ data });
  res.json(address);
});

app.put('/api/addresses/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const address = await prisma.address.update({ where: { id }, data });
  res.json(address);
});

app.delete('/api/addresses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.address.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: 'Cannot delete address with associated records.' });
  }
});

// ==================== Population API ====================
app.get('/api/populations', async (req, res) => {
  const populations = await prisma.population.findMany();
  res.json(populations);
});

app.post('/api/populations', async (req, res) => {
  const data = req.body;
  const pop = await prisma.population.create({ data });
  res.json(pop);
});

app.put('/api/populations/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const pop = await prisma.population.update({ where: { id: Number(id) }, data });
  res.json(pop);
});

app.delete('/api/populations/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.population.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});

// ==================== House API ====================
app.get('/api/houses', async (req, res) => {
  const houses = await prisma.house.findMany({
    include: { address: { include: { populations: true } } }
  });
  res.json(houses);
});

app.post('/api/houses', async (req, res) => {
  const data = req.body;
  const house = await prisma.house.create({ data });
  res.json(house);
});

app.put('/api/houses/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const house = await prisma.house.update({ where: { id: Number(id) }, data });
  res.json(house);
});

app.delete('/api/houses/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.house.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});

// ==================== Unit API ====================
app.get('/api/units', async (req, res) => {
  const units = await prisma.unit.findMany({
    include: { address: true }
  });
  res.json(units);
});

app.post('/api/units', async (req, res) => {
  const data = req.body;
  const unit = await prisma.unit.create({ data });
  res.json(unit);
});

app.put('/api/units/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const unit = await prisma.unit.update({ where: { id: Number(id) }, data });
  res.json(unit);
});

app.delete('/api/units/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.unit.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});

// ==================== Facility API ====================
app.get('/api/facilities', async (req, res) => {
  const facilities = await prisma.facility.findMany({
    include: { address: true }
  });
  res.json(facilities);
});

app.post('/api/facilities', async (req, res) => {
  const data = req.body;
  const facility = await prisma.facility.create({ data });
  res.json(facility);
});

app.put('/api/facilities/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const facility = await prisma.facility.update({ where: { id: Number(id) }, data });
  res.json(facility);
});

app.delete('/api/facilities/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.facility.delete({ where: { id: Number(id) } });
  res.json({ success: true });
});

// ==================== Order API ====================
app.get('/api/orders', async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  const data = req.body;
  const order = await prisma.order.create({ data });
  res.json(order);
});

app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const order = await prisma.order.update({ where: { id: Number(id) }, data });
  res.json(order);
});

app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.order.delete({ where: { id: Number(id) } });
  res.json({ success: true });
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
