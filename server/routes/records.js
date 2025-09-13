import connectDB from "../db/connection.js";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const db = await connectDB();
    const records = await db.collection("User").find().toArray();
    res.json(records);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
    res
      .status(201)
      .json({
        user: {
          _id: result.insertedId,
          name:name,
          fname:fname,
          age:age,
          email:email,
      }});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

export default router;
