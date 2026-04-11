import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (
    (req.originalUrl.startsWith('/api/auth') && req.originalUrl !== '/api/auth/me') || 
    req.originalUrl.startsWith('/api/config')
  ) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    (req as any).user = user;
    next();
  });
};

app.use('/api', authenticateToken);

// ==================== Auth API ====================
app.get('/api/auth/me', async (req: any, res) => {
  try {
    // req.user is set by authenticateToken middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { roles: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { username, password, name, roleIds } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        status: 'pending',
        roles: roleIds && roleIds.length > 0 ? { connect: roleIds.map((id: number) => ({ id })) } : undefined
      }
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username }, include: { roles: true } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ error: `Account status is ${user.status}` });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ token, user: userWithoutPassword });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

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
  try {
    const data = req.body;
    const address = await prisma.address.create({ data });
    res.json(address);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/addresses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const address = await prisma.address.update({ where: { id }, data });
    res.json(address);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/addresses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.address.delete({ where: { id } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== Population API ====================
app.get('/api/populations', async (req, res) => {
  const populations = await prisma.population.findMany();
  res.json(populations);
});

app.post('/api/populations', async (req, res) => {
  try {
    const data = req.body;
    const pop = await prisma.population.create({ data });
    res.json(pop);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/populations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const pop = await prisma.population.update({ where: { id: Number(id) }, data });
    res.json(pop);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/populations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.population.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== House API ====================
app.get('/api/houses', async (req, res) => {
  const houses = await prisma.house.findMany({
    include: { address: { include: { populations: true } } }
  });
  res.json(houses);
});

app.post('/api/houses', async (req, res) => {
  try {
    const data = req.body;
    const house = await prisma.house.create({ data });
    res.json(house);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/houses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const house = await prisma.house.update({ where: { id: Number(id) }, data });
    res.json(house);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/houses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.house.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== Unit API ====================
app.get('/api/units', async (req, res) => {
  const units = await prisma.unit.findMany({
    include: { address: true }
  });
  res.json(units);
});

app.post('/api/units', async (req, res) => {
  try {
    const data = req.body;
    const unit = await prisma.unit.create({ data });
    res.json(unit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const unit = await prisma.unit.update({ where: { id: Number(id) }, data });
    res.json(unit);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/units/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.unit.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== Facility API ====================
app.get('/api/facilities', async (req, res) => {
  const facilities = await prisma.facility.findMany({
    include: { address: true }
  });
  res.json(facilities);
});

app.post('/api/facilities', async (req, res) => {
  try {
    const data = req.body;
    const facility = await prisma.facility.create({ data });
    res.json(facility);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/facilities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const facility = await prisma.facility.update({ where: { id: Number(id) }, data });
    res.json(facility);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/facilities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.facility.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== Order API ====================
app.get('/api/orders', async (req, res) => {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

app.post('/api/orders', async (req, res) => {
  try {
    const data = req.body;
    const order = await prisma.order.create({ data });
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const order = await prisma.order.update({ where: { id: Number(id) }, data });
    res.json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
})

// ==================== User API ====================
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany({ include: { roles: true } });
  const usersWithoutPassword = users.map((u: any) => {
    const { password, ...rest } = u;
    return rest;
  });
  res.json(usersWithoutPassword);
});

app.post('/api/users', async (req, res) => {
  const { username, password, name, status, roleIds } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { 
        username, 
        password: hashedPassword, 
        name, 
        status, 
        roles: roleIds && roleIds.length > 0 ? { connect: roleIds.map((id: number) => ({ id })) } : undefined 
      },
      include: { roles: true }
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { password, roleIds, ...data } = req.body;
  try {
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    const updateData: any = { ...data };
    if (roleIds !== undefined) {
      updateData.roles = { set: roleIds.map((id: number) => ({ id })) };
    }
    
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      include: { roles: true }
    });
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ==================== Role API ====================
app.get('/api/roles', async (req, res) => {
  const roles = await prisma.role.findMany();
  res.json(roles);
});

app.post('/api/roles', async (req, res) => {
  const data = req.body;
  try {
    const role = await prisma.role.create({ data });
    res.json(role);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/roles/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const role = await prisma.role.update({ where: { id: Number(id) }, data });
    res.json(role);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/roles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.role.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
