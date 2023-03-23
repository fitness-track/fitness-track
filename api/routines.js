const express = require('express');
const router = express.Router();
const {getRoutineById, getRoutinesWithoutActivities, getAllRoutines, getAllRoutinesByUser,
       getPublicRoutinesByUser, getPublicRoutinesByActivity, createRoutine, updateRoutine, 
       destroyRoutine} = require("../db")

// GET /api/routines
router.get("/routines", async(req, res)=>{
  const request = await getAllRoutines();
  res.send(request);
})
// POST /api/routines
router.post("/routines", async(req, res)=>{
  const request = await createRoutine(req.body);
  res.send(request);
})
// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
