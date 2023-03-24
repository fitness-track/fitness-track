const express = require('express');
const routineActivitiesRouter = express.Router();
const {
  updateRoutineActivity,
  destroyRoutineActivity,
} = require('../db');

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch('/:routineActivityId', async (req,res,next) =>{
  const { id } = req.params;
  const { count, duration } = req.body
  const updateFields = {}
  try{
      updateFields.id = id;
      updateFields.count = count;
      updateFields.duration = duration;

      const routineActivities = await updateRoutineActivity(updateFields);
      res.send({
          routineActivities
      })
  }catch({routineActivities}){
      console.log('There was a error in the PATCH routineActivities router')
      next({routineActivities})
  }
  });

// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete('/:routineActivityId', async (req, res, next) => {
  console.log("Trying the routineActivity delete function in api-routinesActivities.js")
  try {
    const { routineActivityId } = req.params;
    const { user } = req.body
    
    if (routineActivityId && routineActivityId.creatorId === user.id){
      const routineActivity = await destroyRoutineActivity(routineActivityId);
      res.send({ routineActivity });

    } else {
        next({
          name: "ThereWasAnError",
          message: "ErrorAtDeleteRoutineActivities"
        });
      }
  } catch ({ name, message }) {
    next({ name, message })
  }
});
module.exports = routineActivitiesRouter;
