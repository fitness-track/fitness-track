const client = require('./client');

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try{
    console.log('Creating the new activity in db/activities.js')
    console.log("Name: ", name);
    console.log("description: ", description);
    const { rows:[activity]} = await client.query(`
      INSERT INTO activities (name, description)
      VALUES($1, $2)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `,[name, description]);
    console.log('Completed creating the new activity in db/activities.js', activity)
    return activity
  }catch(error){
    console.log('There was an error creating your new activity. Error: ', error)
    throw error;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  console.log('Getting all activities')
  try{
    const {rows} = await client.query(`
      SELECT *
      FROM activities
    `)
    console.log('Finished getting all activities')
    return rows;
  }catch(error){
    console.log(`There was an issue getting all activities`)
    throw error
  }
}

async function getActivityById(activityId) {
  console.log('Getting activity by id')
  try{
    const{rows:[activity]} = await client.query(`
      SELECT *
      FROM activities
      WHERE id=${activityId};
    `,)
    console.log('Finished getting activity by id')
    return activity;
  }catch(error){
    console.log(`There was an issue getting the activity by id`)
    throw error
  }
}
//not listed in the course page
async function getActivityByName(name) {
  console.log('Getting activity by name')
  try{
    const{rows:[activity]}= await client.query(`
      SELECT *
      FROM activities
      WHERE name=$1;
    `,[name])
    console.log('Finished getting activity by name')
    return activity;
  }catch(error){
    console.log(`There was an issue getting the activity by name`)
    throw error
  }
}

// used as a helper inside db/routines.js
async function attachActivitiesToRoutines(routines) {
  //need a check whether we need "creatorId" or "IsPublic" from routines -CL
  try{
    console.log('Attaching activities to routines')
    const {rows:fullRoutine} = await client.query(`
      SELECT routines.id, routines.name, routines.goal
      FROM routines
      JOIN activities ON activities.id = routines.id;
    `,[routines]);
    console.log('Finished attaching activities to routines')
    return fullRoutine
  }catch(error){
    console.log('There was an error attching activities to routines')
    throw error
  }
}

async function updateActivity({ id, ...fields }) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  console.log('Updating activity')
    const setActivity = Object.keys(fields).map(
      (key,index) => `"${key}"=$${index + 1}`
    ).join(',');

    if (setActivity.length === 0){
      return;
    }

    try{
      const {rows:[activity]} = await client.query(`
      UPDATE activities
      SET ${setActivity}
      WHERE id=${id}
      RETURNING *;
      `,Object.values(fields));
      console.log('Finished updating activity')
      return activity
    }catch(error){
      console.log('There was an error updating the activity')
    }
}
     
module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
