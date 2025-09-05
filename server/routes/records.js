import express from 'express';
import connectDB from '../db/connection.js';

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const db = await connectDB();
    const records = await db.collection('User').find().toArray();
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/addUser', async (req, res) => {
  try {
    const name = req.body.name || "";
    const age = req.body.age || "";
    if (!name || !age) {
    return res.status(400).json({ error: 'Name and age are required.' });
    }
    const db = await connectDB();
    const result = await db.collection('User').insertOne({ name, age });
    res.status(201).json({ _id: result.insertedId, name, age });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/login/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const db = await connectDB();
    const user = await db.collection('User').findOne({ name });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
