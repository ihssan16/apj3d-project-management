const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { name, email, password, role, department } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO team_member (name, email, password_hash, role, department) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [name, email, hash, role, department]
  );
  res.json(result.rows[0]);
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM team_member WHERE email=$1', [email]);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user });
});

module.exports = router;