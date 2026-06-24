const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/:project_id', auth, async (req, res) => {
  const result = await pool.query(
    `SELECT pr.*, tm.name as member_name FROM performance_record pr
     JOIN team_member tm ON tm.id = pr.member_id
     WHERE pr.project_id=$1`,
    [req.params.project_id]
  );
  res.json(result.rows);
});

module.exports = router;