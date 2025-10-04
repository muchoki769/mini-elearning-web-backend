const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

router.get('/', async (req, res) => {
    try{
          console.log('Fetching courses from database...');
        const courses = await pool.query(`
            SELECT c.*,
            COUNT(up.id) as enrolled_students,
            AVG(CASE WHEN up.completed THEN 1 ELSE 0 END) as completion_rate
            FROM courses c
            LEFT JOIN user_progress up ON c.id = up.id
            GROUP BY c.id
            ORDER BY c.created_at DESC
            `);
             res.json(courses.rows);
    } catch(error) {
        console.error('❌ Database error in /api/courses:', error);
          res.status(500).json({ message: 'Server error' });
    }
})

router.get('/:id', async (req, res) => {
    try{
        const course = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [req.params.id]
    );

    if (course.rows.length === 0) {
         return res.status(404).json({ message: 'Course not found' });
    }

     res.json(course.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;