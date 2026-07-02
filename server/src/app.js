const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const questionRoutes = require('./routes/question.routes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const config = require('./config');
const { loadCatalog } = require('./services/catalogService');

loadCatalog();

const app = express();

app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.clientOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts. Please try again later.' },
});

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/questions', authLimiter, questionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.use((error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  response.status(statusCode).json({
    message: statusCode >= 500 ? 'Something went wrong' : error.message,
  });
});

module.exports = app;