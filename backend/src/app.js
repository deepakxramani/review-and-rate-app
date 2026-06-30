const express = require('express');
const cors = require('cors');

const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');

const app = express();
const routes = require('./routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);

// Static folder for uploaded files
app.use('/uploads', express.static('public/uploads'));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running 🚀',
  });
});

// 404 Middleware
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
