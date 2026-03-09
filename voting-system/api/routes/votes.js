const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifyApiKey, verifyToken, verifyRole } = require("../middleware/auth");

// POST /votes — cast a vote
router.post("/", verifyApiKey, verifyToken, async (req, res) => {
  const { candidate_id, position_id, election_id } = req.body;
  const user_id = req.user.user_id;

  try {
    // 1. Check if election is active
    const [election] = await db.query(
      `SELECT * FROM elections WHERE election_id = ? AND election_status = 'active'`,
      [election_id]
    );
    if (election.length === 0) {
      return res.status(400).json({ message: "Election is not active" });
    }

    // 2. Check if user already voted for this position
    const [existing] = await db.query(
      `SELECT vote_id FROM votes 
       WHERE user_id = ? AND position_id = ? AND election_id = ?`,
      [user_id, position_id, election_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "You already voted for this position" });
    }

    // 3. Check candidate validity
    const [candidate] = await db.query(
      `SELECT * FROM candidates 
       WHERE candidate_id = ? AND position_id = ? AND election_id = ?`,
      [candidate_id, position_id, election_id]
    );
    if (candidate.length === 0) {
      return res.status(404).json({ message: "Candidate not found for this position/election" });
    }

    // 4. Cast the vote
    const [result] = await db.query(
      `INSERT INTO votes (user_id, position_id, candidate_id, election_id)
       VALUES (?, ?, ?, ?)`,
      [user_id, position_id, candidate_id, election_id]
    );

    // 5. Get updated results and emit to election room
    const [updatedResults] = await db.query(
      `SELECT 
         c.candidate_id,
         c.firstname,
         c.lastname,
         c.alias,
         p.position_name,
         COUNT(v.vote_id) AS vote_count
       FROM candidates c
       JOIN position p ON c.position_id = p.position_id
       LEFT JOIN votes v ON v.candidate_id = c.candidate_id AND v.election_id = ?
       WHERE c.election_id = ?
       GROUP BY c.candidate_id, c.firstname, c.lastname, c.alias, p.position_name
       ORDER BY p.position_name, vote_count DESC`,
      [election_id, election_id]
    );

    // Emit to everyone watching this election
    req.io.to(`election_${election_id}`).emit("vote_update", updatedResults);

    res.status(201).json({ message: "Vote cast successfully", vote_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cast vote", error: err.message });
  }
});

// GET /votes/results/:election_id — get live vote counts per candidate
router.get("/results/:election_id", verifyApiKey, verifyToken, async (req, res) => {
  const { election_id } = req.params;
  try {
    const [results] = await db.query(
      `SELECT 
         c.candidate_id,
         c.firstname,
         c.lastname,
         c.alias,
         p.position_id,
         p.position_name,
         COUNT(v.vote_id) AS vote_count
       FROM candidates c
       JOIN position p ON c.position_id = p.position_id
       LEFT JOIN votes v ON v.candidate_id = c.candidate_id AND v.election_id = ?
       WHERE c.election_id = ?
       GROUP BY c.candidate_id, c.firstname, c.lastname, c.alias, p.position_id, p.position_name
       ORDER BY p.position_name, vote_count DESC`,
      [election_id, election_id]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch results", error: err.message });
  }
});

// GET /votes/check/:election_id — check if current user already voted
router.get("/check/:election_id", verifyApiKey, verifyToken, async (req, res) => {
  const { election_id } = req.params;
  const user_id = req.user.user_id;
  try {
    const [rows] = await db.query(
      `SELECT position_id FROM votes WHERE user_id = ? AND election_id = ?`,
      [user_id, election_id]
    );
    res.json({
      hasVoted: rows.length > 0,
      votedPositions: rows.map(r => r.position_id)
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to check vote status", error: err.message });
  }
});

// GET /votes/admin/:election_id — admin only, full vote list
router.get("/admin/:election_id", verifyApiKey, verifyToken, verifyRole("admin"), async (req, res) => {
  const { election_id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT v.vote_id, u.firstname, u.lastname, u.student_id,
              c.firstname AS candidate_firstname, c.lastname AS candidate_lastname,
              p.position_name
       FROM votes v
       JOIN users u ON v.user_id = u.user_id
       JOIN candidates c ON v.candidate_id = c.candidate_id
       JOIN position p ON v.position_id = p.position_id
       WHERE v.election_id = ?`,
      [election_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch votes", error: err.message });
  }
});

module.exports = router;

