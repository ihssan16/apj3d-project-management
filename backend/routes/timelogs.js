const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { task_id, member_id, date, hours_logged, notes } = req.body;
  await pool.query(
    'INSERT INTO time_log (task_id, member_id, date, hours_logged, notes) VALUES ($1,$2,$3,$4,$5)',
    [task_id, member_id, date, hours_logged, notes]
  );
  await pool.query('UPDATE task SET logged_hours = logged_hours + $1 WHERE id=$2', [hours_logged, task_id]);
  const task = await pool.query('SELECT project_id, deadline FROM task WHERE id=$1', [task_id]);
  await pool.query(
    'UPDATE project_assignment SET hours_used = hours_used + $1 WHERE project_id=$2 AND member_id=$3',
    [hours_logged, task.rows[0].project_id, member_id]
  );
  const today = new Date().toISOString().split('T')[0];
  const deadline = task.rows[0].deadline ? new Date(task.rows[0].deadline).toISOString().split('T')[0] : null;
  if (deadline && today > deadline) {
    await pool.query(
      `INSERT INTO breach_log (task_id, member_id, original_deadline, reason) VALUES ($1,$2,$3,'Deadline exceeded')`,
      [task_id, member_id, deadline]
    );
  }
  await recalcPerformance(member_id, task.rows[0].project_id);
  res.json({ message: 'Time logged successfully' });
});

async function recalcPerformance(member_id, project_id) {
  const a = await pool.query('SELECT allocated_hours, hours_used FROM project_assignment WHERE member_id=$1 AND project_id=$2', [member_id, project_id]);
  const t = await pool.query("SELECT COUNT(*) as total, SUM(CASE WHEN status='Completed' THEN 1 ELSE 0 END) as completed FROM task WHERE assigned_to=$1 AND project_id=$2", [member_id, project_id]);
  const b = await pool.query('SELECT COUNT(*) as count FROM breach_log WHERE member_id=$1 AND task_id IN (SELECT id FROM task WHERE project_id=$2)', [member_id, project_id]);
  if (!a.rows[0]) return;
  const { allocated_hours, hours_used } = a.rows[0];
  const { total, completed } = t.rows[0];
  const breachCount = parseInt(b.rows[0].count);
  const taskScore = total > 0 ? (completed / total) * 40 : 0;
  const hourScore = allocated_hours > 0 ? ((allocated_hours - hours_used) / allocated_hours) * 40 : 0;
  let score = Math.max(0, Math.min(80, taskScore + hourScore - breachCount * 10));
  let tag = score >= 60 ? 'Exceeding' : score >= 40 ? 'On Track' : score >= 20 ? 'Lagging' : 'Critical';
  await pool.query(
    `INSERT INTO performance_record (member_id, project_id, score, status_tag, computed_at) VALUES ($1,$2,$3,$4,NOW())
     ON CONFLICT (member_id, project_id) DO UPDATE SET score=$3, status_tag=$4, computed_at=NOW()`,
    [member_id, project_id, score, tag]
  );
}

module.exports = router;