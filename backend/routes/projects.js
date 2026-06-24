const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM project ORDER BY id DESC');
  res.json(result.rows);
});

router.get('/:id', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM project WHERE id=$1', [req.params.id]);
  res.json(result.rows[0]);
});

router.post('/', auth, async (req, res) => {
  const { name, client, type, priority, start_date, end_date, total_hours, budget, scope } = req.body;
  const code = 'PRJ-' + Date.now();
  const result = await pool.query(
    `INSERT INTO project (project_code, name, client, type, priority, start_date, end_date, total_hours, budget, scope, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Draft') RETURNING *`,
    [code, name, client, type, priority, start_date, end_date, total_hours, budget, scope]
  );
  res.json(result.rows[0]);
});

router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const result = await pool.query('UPDATE project SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
  res.json(result.rows[0]);
});

module.exports = router;