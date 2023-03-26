const express = require('express');
const router = express.Router();
const twoCents = {
  health: "Healthy because it's a 2 instead of a 5",
  uptime: process.uptime(),
  message: "Doing excellent",
  date: new Date()
  }

// GET /api/health
router.get('/health', async (req, res, next) => {
  res.status(200).send(twoCents)
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;
