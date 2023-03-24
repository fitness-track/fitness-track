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

async function getRoutineById(id) {
  console.log('Running getRoutineById function in db routines.js')
  try{
    const{ rows: routines} = await client.query(`
      SELECT * 
      FROM routines
      WHERE Id = $1;
    `, [id])
    console.log('Finished running getRoutineById function in db routines.js')
    return routines;
  }catch(error){
    console.log(`Error in getRoutineById function in db routines.js: ${error}`)
    throw error
  }
}

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

async function getAllRoutines() {
  // select and return an array of all activities
  console.log('Running getAllRoutines function in db routines.js')
  try{
    const{rows} = await client.query(`
      SELECT * FROM routines;
    `)
    console.log('Finished running getAllRoutines function in db routines.js')
    return rows;
  }catch(error){
    console.log(`Error in getAllRoutines function in db routines.js: ${error}`)
    throw error
  }
}

async function getAllPublicRoutines() {
  // select and return an array of all activities
  console.log('Running getAllPublicRoutines function in db routines.js')
  try{
    const{rows} = await client.query(`
      SELECT * FROM routines
      WHERE "isPublic" = "true";
    `)
    console.log('Finished running getAllPublicRoutines function in db routines.js')
    return rows;
  }catch(error){
    console.log(`Error in getAllPublicRoutines function in db routines.js: ${error}`)
    throw error
  }
}

async function getAllRoutinesByUser({ username }) {
  console.log('Running getAllRoutinesByUser function in db routines.js')
  try{
    const{ rows: routines} = await client.query(`
      SELECT * 
      FROM routines
      JOIN users
      ON routines.id = users.id
      WHERE users.username = $1;
    `, [username])
    console.log('Finished running getAllRoutinesByUser function in db routines.js')
    return routines;
  }catch(error){
    console.log(`Error in getAllRoutinesByUser function in db routines.js: ${error}`)
    throw error
  }

}

async function getPublicRoutinesByUser({ username }) {
  console.log('Running getPublicRoutinesByUser function in db routines.js')
  try{
    const{ rows: routines} = await client.query(`
      SELECT * 
      FROM routines
      JOIN users
      ON "routines.creatorId" = users.id
      WHERE users.username = $1 AND "routines.isPublic" = "true";
    `, [username])
    console.log('Finished running getPublicRoutinesByUser function in db routines.js')
    return routines;
  }catch(error){
    console.log(`Error in getPublicRoutinesByUser function in db routines.js: ${error}`)
    throw error
  }
}

async function getPublicRoutinesByActivity({ id }) {
  console.log('Running getPublicRoutinesByActivity function in db routines.js')
  try{
    const{ rows: routines} = await client.query(`
      SELECT * 
      FROM routines
      WHERE Id = $1 and "routines.isPublic" = "true";
    `, [id])
    console.log('Finished running getPublicRoutinesByActivity function in db routines.js')
    return routines;
  }catch(error){
    console.log(`Error in getPublicRoutinesByActivity function in db routines.js: ${error}`)
    throw error
  }
}

async function updateRoutine({ id, ...fields }) {
  console.log('Running updateRoutine function in db routines.js')
  const setRoutine = Object.keys(fields).map(
    (key,index) => `"${key}"=$${index + 1}`
  ).join(',');

  if (setRoutine.length === 0){
    return;
  }

  try{
    const {rows:[routine]} = await client.query(`
    UPDATE routines
    SET ${setRoutine}
    WHERE id=${id}
    RETURNING *;
    `,Object.values(fields));
    console.log('Finished running updateRoutine function in db routines.js')
    return routine
  }catch(error){
    console.log(`There was an error running updateRoutine function in db routines.js: ${error}`)
  }
}

// async function destroyRoutine(id) {

//<<<<<<< feat/#320-finish-remaining-routine-functions
// }
//=======
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
//>>>>>>> main

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
//<<<<<<< feat/#320-finish-remaining-routine-functions
  updateRoutine,
  // destroyRoutine,
//=======
  // updateRoutine,
  destroyRoutine
//>>>>>>> main
};
