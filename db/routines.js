const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  console.log("Running createRoutine function in db routines.js")
  try {
    const { rows: [ routine ] } = await client.query(`
      INSERT INTO routines("creatorId", "isPublic", name, goal)
      VALUES($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);
    console.log("Exiting createRoutine function in db routines.js")
    return routine;

  }catch(err){
    console.error("Error in createRoutine - db routines.js", err)
    throw err
  }
}

// async function getRoutineById(id) {}

async function getRoutinesWithoutActivities() {
  console.log("Running getRoutinesWithoutActivities function in db routines.js")
  try {
    const { rows } = await client.query(`
      SELECT * FROM routines;
    `);

    console.log("Exiting getRoutinesWithoutActivities function in db routines.js")
    return rows;
  } catch(err) {
    console.error("Error in getRoutinesWithoutActivities in db routines.js", err);
    throw err;
  }
}

// async function getAllRoutines() {}

// async function getAllPublicRoutines() {}

// async function getAllRoutinesByUser({ username }) {}

// async function getPublicRoutinesByUser({ username }) {}

// async function getPublicRoutinesByActivity({ id }) {}

// async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {
  try{
    console.log("Running destroyRoutine function in db routines.js")
    const { rows } = await client.query(`
      DELETE * 
      FROM routines 
      JOIN routine_activities ON "routine_activities.routineId" = routine.id
      WHERE "routineId"=$1;
      `,[id])   
    console.log("Completed destroyRoutine function in db routines.js")
    return rows
  }catch (err){
    console.error("Error running destroyRoutine function in db routines.js", err);
    throw err
  }
}

module.exports = {
  // getRoutineById,
  getRoutinesWithoutActivities,
  // getAllRoutines,
  // getAllPublicRoutines,
  // getAllRoutinesByUser,
  // getPublicRoutinesByUser,
  // getPublicRoutinesByActivity,
  createRoutine,
  // updateRoutine,
  destroyRoutine
};
