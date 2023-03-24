const express = require('express');
const routineRouter = express.Router();
const jwt = require("jsonwebtoken")
const jwt_secret = "verysecretive"

const {getRoutineById, getRoutinesWithoutActivities, getAllRoutines, getAllRoutinesByUser,
       getPublicRoutinesByUser, getPublicRoutinesByActivity, createRoutine, updateRoutine, 
       destroyRoutine, updateRoutineActivity} = require("../db")

// GET /api/routines
routineRouter.get("/", async(req, res)=>{
  console.log("GET request for /routines received in api-routines.js")
  console.log("req.body: ", req.body)
  const request = await getAllRoutines();
  res.send(request);
})

// POST /api/routines
routineRouter.post("/", async(req, res, next)=>{
  console.log("GET request for /routines received in api-routines.js")
  console.log("req.body: ", req.body)
  try{
    const {creatorId, isPublic, name, goal} = req.body
    const routineData = {}
    routineData.creatorId=creatorId;
    routineData.isPublic=isPublic;
    routineData.name=name;
    routineData.goal=goal;
    const result = await createRoutine(routineData)
    console.log("result = ", result)
    res.send(result);
  }catch(error){
    console.error("There was an error in POST /routines api-routines.js", error)
    next();
  }
  
})

// PATCH /api/routines/:routineId
routineRouter.patch("/:routineId", async(req, res, next)=>{
  console.log("PATCH request for /routines /:routineId received in api-routines.js")
  console.log("req.body: ", req.body)

  const { routineId } = req.params;
  const { user, isPublic, name, goals } = req.body;

  const updateFields = {};

  if (isPublic.length > 0){
    updateFields.isPublic = isPublic;
  }

  if (name){
    updateFields.name = name;
  }  

  if (goals){
    updateFields.goals = goals;
  }

  try {

    if (routineId && routineId.creatorId === user.id){
      const updatedRoutine = await updateRoutine(routineId, updateFields);
      res.send({ routine: updatedRoutine })
    } else {
      next({
        name: 'UnauthorizedUserError',
        message: 'You cannot update a routine that is not yours'
      })
    }
  } catch ( {name, message }) {
    next( { name, message });
  }
});

// DELETE /api/routines/:routineId
routineRouter.delete('/:routineId', async (req, res, next) => {
  console.log("Trying the routineActivity delete function in api-routines.js")
  try {
    const { routineId } = req.params;
    const { user } = req.body
    
    if (routineId && routineId.creatorId === user.id){
      const routine = await destroyRoutine(routineId);
      res.send({ routine });

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


// POST /api/routines/:routineId/activities
routineRouter.patch('/:routineId/activities', async (req, res, next) => {
  console.log("Attempting to add an activity to an existing routine")
  try{
    const { routineAcitvityId } = req.params;
    const { duration, count } = req.body;

    const updateFields = {}
    updateFields.activityId = routineAcitvityId
    updateFields.duration = duration
    updateFields.count = count
    const result = await updateRoutineActivity(updateFields)
  
    res.send({ routine: result }) 
  } catch ( {name, message }) {
    next( { name, message });
  }
})


module.exports = routineRouter;
