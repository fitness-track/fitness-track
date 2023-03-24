const express = require('express');
const routineRouter = express.Router();
const jwt = require("jsonwebtoken")
const jwt_secret = "verysecretive"

const {getRoutineById, getRoutinesWithoutActivities, getAllRoutines, getAllRoutinesByUser,
       getPublicRoutinesByUser, getPublicRoutinesByActivity, createRoutine, updateRoutine, 
       destroyRoutine} = require("../db")

// GET /api/routines
routineRouter.get("/routines", async(req, res)=>{
  console.log("GET request for /routines received in api-routines.js")
  console.log("reg.body: ", req.body)
  const request = await getAllRoutines();
  res.send(request);
})

// POST /api/routines
routineRouter.post("/routines", async(req, res, next)=>{
  console.log("GET request for /routines received in api-routines.js")
  console.log("reg.body: ", req.body)
  try{
    const token = req.header('Authorization')
    const parsedToken = jwt.verify(token, jwt_secret)
    const result = await createRoutine(req.body)
    console.log("result = ", result)
    res.send(result);
  }catch(error){
    console.error("There was an error in POST /routines api-routines.js", error)
  }
  
})


// PATCH /api/routines/:routineId
routineRouter.patch("/routines/:routineId", async(req, res, next)=>{
  console.log("PATCH request for /routines /:routineId received in api-routines.js")
  console.log("reg.body: ", req.body)

  const { routineId } = req.params;
  const { isPublic, name, goals } = req.body;

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
    const originalRoutine = await getRoutineById(routineId);

    if (originalRoutine.creatorId === req.users.id){
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
routineRouter.delete('/routines/:routineId', async (req, res, next) => {
  console.log("Trying the routineRouter.delete function in api-routines.js")
  try {
    const { routineId } = req.params;
    if (routineId.creatorId === user.id){
      const routine = await destroyRoutine(routineId);
      res.send({ routine });
      } else {
        next(routine ? {
          name: "UnauthorizedUserError",
          message: "You cannot delete a routine that doesn't belong to you"
        } : {
          name: "RoutineNotFoundError",
          message: "That routine does not exist"
        });
      }
  } catch ({ name, message }) {
    next({ name, message })
  }
});

// POST /api/routines/:routineId/activities

module.exports = routineRouter;
