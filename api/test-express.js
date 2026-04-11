const express = require('express');
const app = express();
app.use('/api', (req, res, next) => {
  res.json({ path: req.path, originalUrl: req.originalUrl });
});
const server = app.listen(3001, () => console.log('started'));
