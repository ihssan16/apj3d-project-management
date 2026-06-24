const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM team_member ORDER BY name');
  res.json(result.rows);
});

router.post('/', auth, async (req, res) => {
  const { name, email, role, department } = req.body;
  const result = await pool.query(
    'INSERT INTO team_member (name, email, role, department) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, email, role, department]
  );
  res.json(result.rows[0]);
});

module.exports = router;