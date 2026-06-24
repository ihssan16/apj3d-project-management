const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/:project_id', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT t.*, tm.name as member_name FROM task t
     LEFT JOIN team_member tm ON tm.id = t.assigned_to
     WHERE t.project_id=$1 ORDER BY t.id`,
    [req.params.project_id]
  );
  res.json(result.rows);
});

router.post('/', auth, async (req, res) => {
  const { project_id, assigned_to, title, est_hours, deadline, priority, parent_task_id } = req.body;
  const result = await pool.query(
    `INSERT INTO task (project_id, assigned_to, title, est_hours, deadline, priority, status, parent_task_id)
     VALUES ($1,$2,$3,$4,$5,$6,'Not Started',$7) RETURNING *`,
    [project_id, assigned_to, title, est_hours, deadline, priority, parent_task_id || null]
  );
  res.json(result.rows[0]);
});

router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body;
  const result = await pool.query('UPDATE task SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
  res.json(result.rows[0]);
});

module.exports = router;