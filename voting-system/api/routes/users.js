const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { verifyApiKey, verifyToken, verifyRole } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// POST /users/register
router.post("/register", verifyApiKey, async (req, res) => {
  const { student_id, firstname, lastname, alias, course, year_level, email, password, role } = req.body;

  try {
    // Check if email or student_id already exists
    const [existing] = await db.query(
      `SELECT user_id FROM users WHERE email = ? OR student_id = ?`,
      [email, student_id]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email or Student ID already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO users (student_id, firstname, lastname, alias, course, year_level, email, password, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [student_id, firstname, lastname, alias, course, year_level, email, hashedPassword, role || "user"]
    );

    res.status(201).json({ message: "User registered", user_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// POST /users/login
router.post("/login", verifyApiKey, async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );

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
        student_id: user.student_id,
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
        student_id: user.student_id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        course: user.course,
        year_level: user.year_level,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// GET /users — admin only
router.get("/", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT user_id, student_id, firstname, lastname, alias, course, year_level, email, role FROM users`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
});

// GET /users/:id — admin or the user themselves
router.get("/:id", verifyApiKey, verifyToken, async (req, res) => {
  const requestedId = parseInt(req.params.id);
  const requester = req.user;

  // Only allow if admin or requesting own profile
  if (requester.role !== "admin" && requester.user_id !== requestedId) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const [rows] = await db.query(
      `SELECT user_id, student_id, firstname, lastname, alias, course, year_level, email, role FROM users WHERE user_id = ?`,
      [requestedId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

module.exports = router;
