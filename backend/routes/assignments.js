const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/:project_id', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT pa.*, tm.name, tm.email FROM project_assignment pa
     JOIN team_member tm ON tm.id = pa.member_id
     WHERE pa.project_id=$1`,
    [req.params.project_id]
  );
  res.json(result.rows);
});

router.post('/', auth, async (req, res) => {
  const { project_id, assignments } = req.body;
  const project = await pool.query('SELECT total_hours FROM project WHERE id=$1', [project_id]);
  const totalProjectHours = parseFloat(project.rows[0].total_hours);
  const sumAllocated = assignments.reduce((sum, a) => sum + parseFloat(a.allocated_hours), 0);
  if (Math.abs(sumAllocated - totalProjectHours) > 0.01) {
    return res.status(400).json({ error: `Hour mismatch: allocated ${sumAllocated}h but project needs ${totalProjectHours}h` });
  }
  const inserted = [];
  for (const a of assignments) {
    const r = await pool.query(
      'INSERT INTO project_assignment (project_id, member_id, allocated_hours, role, start_date) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [project_id, a.member_id, a.allocated_hours, a.role, a.start_date]
    );
    inserted.push(r.rows[0]);
  }
  res.json(inserted);
});

module.exports = router;