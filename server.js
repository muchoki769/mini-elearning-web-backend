const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors(
  {
  origin: 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
));
app.use(express.json());
app.use(helmet({}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'E-learning API is running!' });
});


// app.get('/api/debug-routes', (req, res) => {
//   const routes = [
//     { method: 'GET', path: '/', description: 'API status' },
//     { method: 'GET', path: '/api/health', description: 'Database health check' },
//     { method: 'GET', path: '/api/courses', description: 'Get all courses' },
//     { method: 'GET', path: '/api/courses/:id', description: 'Get single course' },
//     { method: 'POST', path: '/api/auth/register', description: 'User registration' },
//     { method: 'POST', path: '/api/auth/login', description: 'User login' },
//     { method: 'POST', path: '/api/progress/complete', description: 'Mark course completed' },
//     { method: 'GET', path: '/api/progress/user-progress', description: 'Get user progress' }
//   ];
  
//   res.json({
//     message: 'Available API routes',
//     routes: routes
//   });
// });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});