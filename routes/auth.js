const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

     const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
     if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

     const token = jwt.sign(
      { userId: newUser.rows[0].id },
      process.env.JWT_SECRET ||
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.rows[0].id,
        username: newUser.rows[0].username,
        email: newUser.rows[0].email
      }
    });
  } catch (error) {
      res.status(500).json({ message: 'Server error' });
  }
  
});


router.post('/login', async (req, res) => {
    try{
    const { email, password } = req.body;

    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

     if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

     const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

      if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });

      }
          
    const token = jwt.sign(
      { userId: user.rows[0].id },
      process.env.JWT_SECRET || 
      { expiresIn: '7d' }
    );

     res.json({
      token,
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email
      }
    });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;