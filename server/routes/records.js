import connectDB from "../db/connection.js";
import express from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all users
router.get("/allUsers", async (req, res) => {
  try {
    const db = await connectDB();
    const records = await db.collection("User").find().toArray();
    console.log(`Sending ${records.length} users to client`);
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new user
router.post("/addUser", async (req, res) => {
  try {
    const name = req.body.name;
    const fname = req.body.fname || "";
    const age = req.body.age || "";
    const email = req.body.email || "";
    const password = req.body.password || "";

    if (!name || !age || !email || !password || !fname) {
      return res.status(400).json({
        error: "Name, family name, age, email, and password are required !",
      });
    }

    const db = await connectDB();
    const result = await db
      .collection("User")
      .insertOne({ name, fname, age, email, password });
    res.status(201).json({
      user: {
        _id: result.insertedId,
        name: name,
        fname: fname,
        age: age,
        email: email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const db = await connectDB();
    const user = await db.collection("User").findOne({ email, password });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found or incorrect password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//edit user
router.patch("/editUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, fname, age, email, password } = req.body;

    const db = await connectDB();
    const result = await db
      .collection("User")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { name, fname, age, email, password } }
      );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//delete user
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const db = await connectDB();
    const result = await db
      .collection("User")
      .deleteOne({ _id: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//addConstact
router.post("/addContact", async (req, res) => {
  try {
    const { userId, contactId } = req.body;

    if (!userId || !contactId) {
      return res
        .status(400)
        .json({ error: "userId and contactId are required" });
    }

    const db = await connectDB();
    const result = await db
      .collection("User")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { contacts: contactId } }
      );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Contact added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//myContacts
router.get("/myContacts", async (req, res) => {
  try {
    const db = await connectDB();
    const users = await db.collection("User").find().toArray();

    const contacts = users.filter(
      (user) => user.contacts && user.contacts.length > 0
    );

    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//removeContact
router.post("/removeContact", async (req, res) => {
  try {
    const { userId, contactId } = req.body;

    if (!userId || !contactId) {
      return res
        .status(400)
        .json({ error: "userId and contactId are required" });
    }

    const db = await connectDB();
    const result = await db
      .collection("User")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { contacts: contactId } }
      );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "Contact removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
