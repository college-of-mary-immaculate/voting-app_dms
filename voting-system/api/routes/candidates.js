const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyApiKey, verifyToken, verifyRole } = require("../middleware/auth");

router.get("/", verifyApiKey, verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, p.position_name, e.election_title
       FROM candidates c
       JOIN position p ON c.position_id = p.position_id
       JOIN elections e ON c.election_id = e.election_id`
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
      `SELECT c.*, p.position_name, e.election_title
       FROM candidates c
       JOIN position p ON c.position_id = p.position_id
       JOIN elections e ON c.election_id = e.election_id
       WHERE c.candidate_id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch candidate", error: err.message });
  }
});

router.get("/election/:election_id", verifyApiKey, verifyToken, async (req, res) => {
  const { election_id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT c.*, p.position_name
       FROM candidates c
       JOIN position p ON c.position_id = p.position_id
       WHERE c.election_id = ?
       ORDER BY p.position_name, c.lastname`,
      [election_id]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch candidates", error: err.message });
  }
});

router.post("/", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  const { election_id, firstname, lastname, alias, position_id, photo, bio } = req.body;

  try {
    const [election] = await db.query(
      `SELECT election_id FROM elections WHERE election_id = ?`,
      [election_id]
    );

    if (election.length === 0) {
      return res.status(404).json({ message: "Election not found" });
    }

    const [position] = await db.query(
      `SELECT position_id FROM position WHERE position_id = ?`,
      [position_id]
    );

    if (position.length === 0) {
      return res.status(404).json({ message: "Position not found" });
    }

    const [result] = await db.query(
      `INSERT INTO candidates (election_id, firstname, lastname, alias, position_id, photo, bio) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [election_id, firstname, lastname, alias, position_id, photo || "", bio || ""]
    );

    res.status(201).json({ message: "Candidate added", candidate_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Failed to add candidate", error: err.message });
  }
});

router.put("/:id", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, alias, position_id, photo, bio } = req.body;

  try {
    const [existing] = await db.query(
      `SELECT candidate_id FROM candidates WHERE candidate_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Candidate not found" });
    }

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
    const [existing] = await db.query(
      `SELECT candidate_id FROM candidates WHERE candidate_id = ?`,
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await db.query(`DELETE FROM candidates WHERE candidate_id = ?`, [id]);
    res.json({ message: "Candidate deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete candidate", error: err.message });
  }
});

module.exports = router;
