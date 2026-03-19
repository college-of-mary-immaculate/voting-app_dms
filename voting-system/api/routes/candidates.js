const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyApiKey, verifyToken, verifyRole } = require("../middleware/auth");

router.get("/", verifyApiKey, verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, c.ballot_number, p.position_name, e.election_title
       FROM candidates c
       JOIN position p ON c.position_id = p.position_id
       JOIN elections e ON c.election_id = e.election_id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch candidates", error: err.message });
  }
});

router.get("/election/:election_id", verifyApiKey, verifyToken, async (req, res) => {
  const { election_id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT c.*, c.ballot_number, p.position_name
       FROM candidates c
       JOIN position p ON c.position_id = p.position_id
       WHERE c.election_id = ?
       ORDER BY p.position_name, c.ballot_number`,
      [election_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch candidates", error: err.message });
  }
});

router.get("/:id", verifyApiKey, verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT c.*, c.ballot_number, p.position_name
       FROM candidates c
       JOIN position p ON c.position_id = p.position_id
       WHERE c.candidate_id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Candidate not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch candidate", error: err.message });
  }
});

router.post("/", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  const { election_id, firstname, lastname, alias, position_id, photo, bio } = req.body;
  try {
    const [countResult] = await db.query(
      `SELECT COUNT(*) as count FROM candidates WHERE election_id = ? AND position_id = ?`,
      [election_id, position_id]
    );
    const ballot_number = countResult[0].count + 1;

    const [result] = await db.query(
      `INSERT INTO candidates (election_id, firstname, lastname, alias, position_id, photo, bio, ballot_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [election_id, firstname, lastname, alias, position_id, photo, bio, ballot_number]
    );
    res.status(201).json({ message: "Candidate added", candidate_id: result.insertId, ballot_number });
  } catch (err) {
    res.status(500).json({ message: "Failed to add candidate", error: err.message });
  }
});

router.put("/:id", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, alias, position_id, photo, bio } = req.body;
  try {
    await db.query(
      `UPDATE candidates SET firstname = ?, lastname = ?, alias = ?, position_id = ?, photo = ?, bio = ? WHERE candidate_id = ?`,
      [firstname, lastname, alias, position_id, photo, bio, id]
    );
    res.json({ message: "Candidate updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update candidate", error: err.message });
  }
});

router.delete("/:id", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM candidates WHERE candidate_id = ?`, [id]);
    res.json({ message: "Candidate deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete candidate", error: err.message });
  }
});

module.exports = router;