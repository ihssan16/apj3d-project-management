const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/summary/:project_id', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT p.name, p.total_hours, p.budget, p.status,
      COALESCE(SUM(tl.hours_logged),0) as total_logged,
      COUNT(DISTINCT bl.id) as total_breaches
     FROM project p
     LEFT JOIN task t ON t.project_id = p.id
     LEFT JOIN time_log tl ON tl.task_id = t.id
     LEFT JOIN breach_log bl ON bl.task_id = t.id
     WHERE p.id=$1 GROUP BY p.id`,
    [req.params.project_id]
  );
  res.json(result.rows[0]);
});

router.get('/members/:project_id', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT tm.name, pa.allocated_hours, pa.hours_used,
      COALESCE(pr.score,0) as score, COALESCE(pr.status_tag,'N/A') as status_tag,
      COUNT(DISTINCT bl.id) as breach_count
     FROM project_assignment pa
     JOIN team_member tm ON tm.id = pa.member_id
     LEFT JOIN performance_record pr ON pr.member_id=pa.member_id AND pr.project_id=pa.project_id
     LEFT JOIN breach_log bl ON bl.member_id=pa.member_id
     WHERE pa.project_id=$1
     GROUP BY tm.name, pa.allocated_hours, pa.hours_used, pr.score, pr.status_tag`,
    [req.params.project_id]
  );
  res.json(result.rows);
});

router.get('/lag/:project_id', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT bl.*, tm.name as member_name, t.title as task_title
     FROM breach_log bl
     JOIN team_member tm ON tm.id = bl.member_id
     JOIN task t ON t.id = bl.task_id
     WHERE t.project_id=$1 ORDER BY bl.created_at DESC`,
    [req.params.project_id]
  );
  res.json(result.rows);
});

module.exports = router;