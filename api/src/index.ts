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
});

// ==================== Dispute API ====================
app.get('/api/disputeRecords', async (req, res) => {
  try {
    const disputes = await prisma.disputeRecord.findMany({
      include: { mediator: true, populations: true }
    });
    res.json(disputes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/disputeRecords', async (req, res) => {
  try {
    const { populations, ...data } = req.body;
    const createData: any = { ...data };
    if (populations && populations.length > 0) {
      createData.populations = {
        connect: populations.map((id: number) => ({ id }))
      };
    }
    const dispute = await prisma.disputeRecord.create({ data: createData });
    res.json(dispute);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/disputeRecords/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { populations, ...data } = req.body;
    const updateData: any = { ...data };
    if (populations) {
      updateData.populations = {
        set: populations.map((id: number) => ({ id }))
      };
    }
    const dispute = await prisma.disputeRecord.update({
      where: { id: Number(id) },
      data: updateData
    });
    res.json(dispute);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/disputeRecords/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.disputeRecord.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Project API ====================
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { leader: true }
    });
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = await prisma.project.create({ data: req.body });
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: req.body
    });
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Floating API ====================
app.get('/api/floatingRecords', async (req, res) => {
  try {
    const floatings = await prisma.floatingRecord.findMany({
      include: { population: true, house: true }
    });
    res.json(floatings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/floatingRecords', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.expireDate) {
      data.expireDate = new Date(data.expireDate);
    } else {
      delete data.expireDate;
    }
    const floating = await prisma.floatingRecord.create({ data });
    res.json(floating);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/floatingRecords/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.expireDate) {
      data.expireDate = new Date(data.expireDate);
    } else {
      data.expireDate = null;
    }
    const floating = await prisma.floatingRecord.update({
      where: { id: Number(id) },
      data
    });
    res.json(floating);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/floatingRecords/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.floatingRecord.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Inspection API ====================
app.get('/api/houseInspections', async (req, res) => {
  try {
    const inspections = await prisma.houseInspection.findMany({
      include: { house: true }
    });
    res.json(inspections);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/houseInspections', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.deadline) {
      data.deadline = new Date(data.deadline);
    } else {
      delete data.deadline;
    }
    const inspection = await prisma.houseInspection.create({ data });
    res.json(inspection);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/houseInspections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.deadline) {
      data.deadline = new Date(data.deadline);
    } else {
      data.deadline = null;
    }
    const inspection = await prisma.houseInspection.update({
      where: { id: Number(id) },
      data
    });
    res.json(inspection);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/houseInspections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.houseInspection.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Supervision API ====================
app.get('/api/supervisionTasks', async (req, res) => {
  try {
    const supervisions = await prisma.supervisionTask.findMany({
      include: { handler: true }
    });
    res.json(supervisions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/supervisionTasks', async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.deadline) {
      data.deadline = new Date(data.deadline);
    } else {
      delete data.deadline;
    }
    const supervision = await prisma.supervisionTask.create({ data });
    res.json(supervision);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/supervisionTasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.deadline) {
      data.deadline = new Date(data.deadline);
    } else {
      delete data.deadline;
    }
    const supervision = await prisma.supervisionTask.update({
      where: { id: Number(id) },
      data
    });
    res.json(supervision);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/supervisionTasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.supervisionTask.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== Graph API ====================
app.get('/api/graph/person/:id', async (req, res) => {
  try {
    const personId = Number(req.params.id);
    const person = await prisma.population.findUnique({
      where: { id: personId },
      include: {
        address: true,
        disputes: true,
        floatingRecords: { include: { house: true } },
        sourceRelations: { include: { target: true } },
        targetRelations: { include: { source: true } }
      }
    });

    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }

    // Query owned houses
    const ownedHouses = await prisma.house.findMany({
      where: { ownerName: person.name }
    });

    const nodesMap = new Map();
    const edges = [];

    // Add central person
    nodesMap.set(`person_${person.id}`, {
      id: `person_${person.id}`,
      label: person.name,
      type: 'person',
      properties: {
        type: person.type,
        phone: person.phone,
        gender: person.gender
      }
    });

    // Address/House (from direct address)
    if (person.address) {
      nodesMap.set(`address_${person.address.id}`, {
        id: `address_${person.address.id}`,
        label: person.address.name,
        type: 'address',
        properties: { type: person.address.type }
      });
      edges.push({
        source: `person_${person.id}`,
        target: `address_${person.address.id}`,
        label: '居住在'
      });
    }

    // Floating records / Houses
    person.floatingRecords.forEach(record => {
      if (record.house) {
        nodesMap.set(`house_${record.house.id}`, {
          id: `house_${record.house.id}`,
          label: `房屋 ${record.house.id}`,
          type: 'house',
          properties: { status: record.house.status, usage: record.house.usage }
        });
        edges.push({
          source: `person_${person.id}`,
          target: `house_${record.house.id}`,
          label: '流动居住'
        });
      }
    });

    // Owned houses
    ownedHouses.forEach(house => {
      nodesMap.set(`house_${house.id}`, {
        id: `house_${house.id}`,
        label: `房屋 ${house.id}`,
        type: 'house',
        properties: { status: house.status, usage: house.usage }
      });
      edges.push({
        source: `person_${person.id}`,
        target: `house_${house.id}`,
        label: '产权人'
      });
    });

    // Disputes
    person.disputes.forEach(dispute => {
      nodesMap.set(`dispute_${dispute.id}`, {
        id: `dispute_${dispute.id}`,
        label: dispute.title,
        type: 'dispute',
        properties: { status: dispute.status, type: dispute.type }
      });
      edges.push({
        source: `person_${person.id}`,
        target: `dispute_${dispute.id}`,
        label: '涉事'
      });
    });

    // Social relations
    person.sourceRelations.forEach(rel => {
      nodesMap.set(`person_${rel.target.id}`, {
        id: `person_${rel.target.id}`,
        label: rel.target.name,
        type: 'person',
        properties: { type: rel.target.type }
      });
      edges.push({
        source: `person_${person.id}`,
        target: `person_${rel.target.id}`,
        label: rel.relation
      });
    });

    person.targetRelations.forEach(rel => {
      nodesMap.set(`person_${rel.source.id}`, {
        id: `person_${rel.source.id}`,
        label: rel.source.name,
        type: 'person',
        properties: { type: rel.source.type }
      });
      edges.push({
        source: `person_${rel.source.id}`,
        target: `person_${person.id}`,
        label: rel.relation
      });
    });

    const nodes = Array.from(nodesMap.values());
    res.json({ nodes, edges });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

setInterval(() => {}, 1000 * 60 * 60); // Keep alive

