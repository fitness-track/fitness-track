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
    //Team this was changed due to the test requirement parameters. Needed and alias and users table join
    // ALIAS syntax SELECT column_name AS alias_name
    const{rows: routines} = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId"=users.id;
    `);

    const {rows:mergedActivities}= await client.query(`
      SELECT *
      FROM routine_activities
      FULL JOIN activities
      ON routine_activities."activityId" = activities.id;
    `)
    
    console.log('Finished running getAllRoutines function in db routines.js')
    console.log("You are loooking for this!!!!!!", routines)
    // const combinedRoutine = await attachActivitiesForRoutineFunctions(routines);
    // return combinedRoutine
    return attachActivitiesToRoutines(routines, mergedActivities);
  }catch(error){
    console.log(`Error in getAllRoutines function in db routines.js: ${error}`)
    throw error
  }
}

async function getAllPublicRoutines() {
  // select and return an array of all activities
  console.log('Running getAllPublicRoutines function in db routines.js')
  try{
    const {rows:routines} = await client.query(`
      SELECT routines.*, users.username AS "creatorName"  
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id
      WHERE "isPublic" = true;
    `)
    const {rows: mergedActivities }= await client.query(`
      SELECT *
      FROM routine_activities
      LEFT JOIN activities
      ON routine_activities."activityId" = activities.id;
    `)
    const combinedRoutine = attachActivitiesToRoutines(routines, mergedActivities)
    console.log('Finished running getAllPublicRoutines function in db routines.js')
    return combinedRoutine;
  }catch(error){
    console.log(`Error in getAllPublicRoutines function in db routines.js: ${error}`)
    throw error
  }
}

async function getAllRoutinesByUser({ username }) {
  console.log('Running getAllRoutinesByUser function in db routines.js')
  try{
    const{ rows: routines} = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id
      WHERE users.username = $1;
    `, [username])
    const {rows: mergedActivities }= await client.query(`
      SELECT *
      FROM routine_activities
      LEFT JOIN activities
      ON routine_activities."activityId" = activities.id;
    `)
    const combinedRoutine = attachActivitiesToRoutines(routines, mergedActivities)
    console.log('Finished running getAllRoutinesByUser function in db routines.js')
    return combinedRoutine;
  }catch(error){
    console.log(`Error in getAllRoutinesByUser function in db routines.js: ${error}`)
    throw error
  }

}

async function getPublicRoutinesByUser({ username }) {
  console.log('Running getPublicRoutinesByUser function in db routines.js')
  try{
    const{ rows: routines } = await client.query(`
      SELECT routines.*, users.username as "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id
      WHERE users.username = $1 AND routines."isPublic" = true;
      `, [username]);

      const {rows: mergedActivities }= await client.query(`
        SELECT *
        FROM routine_activities
        LEFT JOIN activities
        ON routine_activities."activityId" = activities.id;
      `)
      const combinedRoutine = attachActivitiesToRoutines(routines, mergedActivities)
      console.log('Finished running getAllPublicRoutinesByUser function in db routines.js')
      return combinedRoutine;
      
  }catch(error){
    console.log(`Error in getAllRoutinesByUser function in db routines.js: ${error}`)
    throw error
  }
}

async function getPublicRoutinesByActivity({ id }) {
  console.log('Running getPublicRoutinesByActivity function in db routines.js')
  try{
    const {rows: routines} = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id
      JOIN routine_activities ON routines.id=routine_activities."routineId"
      WHERE routine_activities."activityId"=$1 AND "isPublic"=true;
    `,[id]);

    return routines;
  }catch(error){
    console.log(`Error in getPublicRoutinesByActivity function in db routines.js`,error)
    throw error;
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
  //David changed this following w3 SQL DELETE syntax DELETE FROM table_name WHERE condition;
  try{
    console.log("Running destroyRoutine function in db routines.js")
    const { rows:[routine] } = await client.query(`
      DELETE 
      FROM routines 
      WHERE id= $1
      RETURNING *;
      `,[id]);

      await client.query(`
        DELETE 
        FROM routine_activities
        WHERE "routineId"=$1
        RETURNING *; 
      `,[id]);
    console.log("Completed destroyRoutine function in db routines.js")
    return routine
  }catch (err){
    console.log("Error running destroyRoutine function in db routines.js", err);
    throw err
  }
}

function attachActivitiesToRoutines (routines, mergedActivities){
  routines.forEach(routine => {
    routine.activities = [];

    mergedActivities.forEach(mergedActivity => {
      if (routine.id === mergedActivity.routineId) {
        routine.activities.push(mergedActivity);
      }
    });
  });
  return routines;
};
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