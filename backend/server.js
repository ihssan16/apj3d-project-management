const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/members', require('./routes/members'));
app.use('/api/estimations', require('./routes/estimations'));
app.use('/api/assignments', require('./routes/assignments'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/timelogs', require('./routes/timelogs'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/reports', require('./routes/reports'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});