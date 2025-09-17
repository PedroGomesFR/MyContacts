import connectDB from "../db/connection.js";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import { generateToken, verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Add a new user with JWT
router.post("/addUser", async (req, res) => {
  try {
    const name = req.body.name;
    const fname = req.body.fname || "";
    const numero = req.body.numero;
    const email = req.body.email || "";
    const password = req.body.password || "";

    if (!name || !numero || !email || !password) {
      return res.status(400).json({
        error: "Name, numero, email, and password are required!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const db = await connectDB();
    const result = await db
      .collection("User")
      .insertOne({ name, fname, numero, email, password: hashedPassword });

    // Generate JWT token
    const token = generateToken(result.insertedId.toString());

    res.status(201).json({
      user: {
        _id: result.insertedId,
        name: name,
        fname: fname,
        numero: numero,
        email: email,
      },
      token,
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

    const user = await db.collection("User").findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // compare les mdp hachés
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      const token = generateToken(user._id.toString());

      res.json({
        user: {
          _id: user._id,
          name: user.name,
          fname: user.fname,
          numero: user.numero,
          email: user.email,
        },
        token,
      });
    } else {
      res.status(401).json({ error: "Incorrect password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//edit user
router.patch("/editUser/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, fname, numero, email, password } = req.body;

    const db = await connectDB();
    const result = await db
      .collection("User")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $set: { name, fname, numero, email, password } }
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

//addConstact (numero)
router.post("/addContact", verifyToken, async (req, res) => {
  try {
    const { userId, name, fname, numero } = req.body;

    if (!userId || !numero) {
      return res.status(400).json({ error: "userId and numero are required" });
    }

    // Generate a unique ID for the contact
    const contactId = new ObjectId().toString();

    const db = await connectDB();
    const result = await db
      .collection("User")
      .updateOne(
        { _id: new ObjectId(userId) },
        { $addToSet: { contacts: { _id: contactId, name, fname, numero } } }
      );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ error: "User not found or contact already exists" });
    }

    res.status(200).json({
      message: "Contact added successfully",
      contact: { _id: contactId, name, fname, numero },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//myContacts
router.get("/myContacts/:id", verifyToken, async (req, res) => {
  try {
    const db = await connectDB();
    const contacts = await db
      .collection("User")
      .findOne(
        { _id: new ObjectId(req.params.id) },
        { projection: { contacts: 1, _id: 0 } }
      );
    if (!contacts) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(contacts.contacts || []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//removeContact
router.delete("/removeContact", verifyToken, async (req, res) => {
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
        { $pull: { contacts: { _id: contactId } } }
      );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "User or contact not found" });
    }

    res.status(200).json({ message: "Contact removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//editContact
router.patch("/editContact", verifyToken, async (req, res) => {
  try {
    const { userId, contactId, updatedContact } = req.body;

    if (!userId || !contactId || !updatedContact) {
      return res.status(400).json({
        error: "userId, contactId, and updatedContact are required",
      });
    }

    const db = await connectDB();

    // Update the contact with the specific ID in the contacts array
    const result = await db.collection("User").updateOne(
      {
        _id: new ObjectId(userId),
        "contacts._id": contactId,
      },
      {
        $set: {
          "contacts.$.name": updatedContact.name,
          "contacts.$.fname": updatedContact.fname,
          "contacts.$.numero": updatedContact.numero,
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "User or contact not found" });
    }

    res.status(200).json({
      message: "Contact updated successfully",
      contact: { _id: contactId, ...updatedContact },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
