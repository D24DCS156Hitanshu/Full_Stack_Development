const express = require('express');
const homeRoute = require('./routes/home');

const app = express();
const PORT = process.env.PORT || 3000;

// Routes
app.use('/', homeRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});