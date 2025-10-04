const express = require('express');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/complete', auth, async (req, res) => {
    try{
         const { courseId } = req.body;
        const userId = req.userId;

       console.log(` User ${userId} marking course ${courseId} as completed`);
         if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

         const existingProgress = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND course_id = $2',
      [userId, courseId]
    );

     if (existingProgress.rows.length > 0) {
        const updatedProgress = await pool.query(
        'UPDATE user_progress SET completed = true, completed_at = CURRENT_TIMESTAMP WHERE user_id = $1 AND course_id = $2 RETURNING *',
        [userId, courseId]
      );
      res.json(updatedProgress.rows[0]);
     } else {
        const newProgress = await pool.query(
        'INSERT INTO user_progress (user_id, course_id, completed, completed_at) VALUES ($1, $2, true, CURRENT_TIMESTAMP) RETURNING *',
        [userId, courseId]
      );
      console.log(`✅ Created new progress for course ${courseId}`);
      res.json(newProgress.rows[0]);
     }
      
    } catch(error) {
        res.status(500).json({ message: 'Server error' });
    }
})

// Get user progress
router.get('/user-progress', auth, async (req, res) => {
     try {
    const userId = req.userId;

     const progress = await pool.query(
    ` SELECT up.*, c.title, c.description, c.instructor
      FROM user_progress up
     LEFT  JOIN courses c ON up.course_id = c.id
      WHERE up.user_id = $1
      ORDER BY up.completed_at DESC NULLS LAST, up.id DESC
      `,
     [userId]);
     console.log(`Found ${progress.rows.length} progress records for user ${userId}`);
     res.json(progress.rows);
         
     } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
     }
     
});

module.exports = router;