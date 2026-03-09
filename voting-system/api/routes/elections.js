const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyApiKey, verifyToken, verifyRole } = require("../middleware/auth");

router.get("/", verifyApiKey, verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM elections`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch elections", error: err.message });
  }
});

router.get("/:id", verifyApiKey, verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [election] = await db.query(
      `SELECT * FROM elections WHERE election_id = ?`, [id]
    );

    if (election.length === 0) {
      return res.status(404).json({ message: "Election not found" });
    }

    const [candidates] = await db.query(
      `SELECT c.*, p.position_name 
       FROM candidates c
       JOIN position p ON c.position_id = p.position_id
       WHERE c.election_id = ?`,
      [id]
    );

    res.json({ ...election[0], candidates });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch election", error: err.message });
  }
});

router.post("/", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  const { start_time, end_time, election_title, election_description } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO elections (start_time, end_time, election_status, election_title, election_description)
       VALUES (?, ?, 'pending', ?, ?)`,
      [start_time, end_time, election_title, election_description]
    );

    res.status(201).json({ message: "Election created", election_id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Failed to create election", error: err.message });
  }
});

router.put("/:id/status", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  const { id } = req.params;
  const { election_status } = req.body;

  const validStatuses = ["pending", "active", "closed"];
  if (!validStatuses.includes(election_status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    await db.query(
      `UPDATE elections SET election_status = ? WHERE election_id = ?`,
      [election_status, id]
    );
    res.json({ message: `Election status updated to '${election_status}'` });
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
});

router.delete("/:id", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM elections WHERE election_id = ?`, [id]);
    res.json({ message: "Election deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete election", error: err.message });
  }
});

module.exports = router;
