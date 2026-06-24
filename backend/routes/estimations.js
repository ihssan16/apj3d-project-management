const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/:project_id', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM estimation WHERE project_id=$1', [req.params.project_id]);
  res.json(result.rows[0]);
});

router.post('/', auth, async (req, res) => {
  const { project_id, est_hours, hourly_rate } = req.body;
  const result = await pool.query(
    'INSERT INTO estimation (project_id, est_hours, hourly_rate, approval_status) VALUES ($1,$2,$3,\'Draft\') RETURNING *',
    [project_id, est_hours, hourly_rate]
  );
  await pool.query("UPDATE project SET status='Pending Estimation' WHERE id=$1", [project_id]);
  res.json(result.rows[0]);
});

router.patch('/:id/approve', auth, async (req, res) => {
  const { approval_status } = req.body;
  const result = await pool.query(
    'UPDATE estimation SET approval_status=$1 WHERE id=$2 RETURNING *',
    [approval_status, req.params.id]
  );
  if (approval_status === 'Approved') {
    await pool.query("UPDATE project SET status='Active' WHERE id=(SELECT project_id FROM estimation WHERE id=$1)", [req.params.id]);
  }
  res.json(result.rows[0]);
});

module.exports = router;