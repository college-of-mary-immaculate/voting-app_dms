const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { verifyApiKey, verifyToken, verifyRole } = require("../middleware/auth");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

router.post("/register", verifyApiKey, async (req, res) => {
  const { firstname, lastname, email, password, role, id_number, age, address } = req.body;
  try {
    const [existing] = await db.query(
      `SELECT user_id FROM users WHERE email = ? OR id_number = ?`,
      [email, id_number]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email or ID number already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO users (firstname, lastname, email, password, role, id_number, age, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstname, lastname, email, hashedPassword, role || "voter", id_number, age || null, address || null]
    );
    res.status(201).json({ message: "User registered", user_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

router.post("/login", verifyApiKey, async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jwt.sign(
      {
        user_id: user.user_id,
        id_number: user.id_number,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        id_number: user.id_number,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        age: user.age,
        address: user.address,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

router.get("/", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, id_number, firstname, lastname, email, age, address, role FROM users`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

router.get("/:id", verifyApiKey, verifyToken, async (req, res) => {
  const requestedId = parseInt(req.params.id);
  const requester = req.user;
  if (requester.role !== "admin" && requester.user_id !== requestedId) {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const [rows] = await db.query(
      `SELECT user_id, id_number, firstname, lastname, email, age, address, role FROM users WHERE user_id = ?`,
      [requestedId]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

router.put("/:id", verifyApiKey, verifyToken, async (req, res) => {
  const requestedId = parseInt(req.params.id);
  const requester = req.user;
  if (requester.role !== "admin" && requester.user_id !== requestedId) {
    return res.status(403).json({ message: "Access denied" });
  }
  const { firstname, lastname, email, age, address } = req.body;
  try {
    await db.query(
      `UPDATE users SET firstname = ?, lastname = ?, email = ?, age = ?, address = ? WHERE user_id = ?`,
      [firstname, lastname, email, age, address, requestedId]
    );
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
});

router.delete("/:id", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM users WHERE user_id = ?`, [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
});

module.exports = router;