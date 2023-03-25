const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration
}) {
  console.log("Running addActivityToRoutine in db outine_activities.js");
  try {
    const { rows: [ routine_activity ] } = await client.query(`
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `, [routineId, activityId, count, duration]);

    console.log("Exiting addActivityToRoutine in db routine_activities.js");
    return routine_activity;

  }catch(err){
    console.error("Error in addActivityToRoutine in db\routine_activities.js", err);
  }
}

async function getRoutineActivityById(id) {
  try{
    console.log('Getting routine activity by id')
    const {rows: [routineActivity]} = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE id=${id}
    `);

    // if (!routineActivity){
    //   return null
    // }
    console.log('Finished getting routine activity by id')
    return routineActivity
  }catch(error){
    console.log('Error getting routine activities by id', error)
    throw error
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try{
    console.log('Getting routine activity by routine')
    const {rows: routines } = await client.query(`
      SELECT *
      FROM routine_activities
      WHERE "routineId" = ${id};
    `);

      return routines;
    // joining tables was not necessary
    // const { rows: activitiesByRoutine } = await client.query(`
    //   SELECT routines.id
    //   FROM routines
    //   JOIN routine_activities ON routines.id=routine_activities.id
    //   WHERE routine_activities."routineId"=$1;
    //   RETURNING *;
    // `, [id]);

    if (!activitiesByRoutine){
      return null
    }
    console.log('Finished getting routine activity by routine')
    return activitiesByRoutine
  }catch(error){
    console.log('Error getting routine activities by routine', error)
    throw error
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  console.log('Updating routine activity')
    const setRoutineActivity = Object.keys(fields).map(
      (key,index) => `"${key}"=$${index + 1}`
    ).join(',');

    if (setRoutineActivity.length === 0){
      return;
    }

    try{
      const {rows:[routineActivity]} = await client.query(`
      UPDATE routine_activities
      SET ${setRoutineActivity}
      WHERE id=${id}
      RETURNING *;
      `,Object.values(fields));
      console.log('Finished updating routine activity')
      return routineActivity
    }catch(error){
      console.log('There was an error updating the routine activity')
    }
}

async function destroyRoutineActivity(id) {
  try{
    console.log('Destroying routine activity')
    const {rows:[routineActivities]} = await client.query(`
      DELETE FROM routine_activities
      WHERE id=${id}
      RETURNING *;
    `);
    console.log('Finished obliterating the routine activity')
    return routineActivities
  }catch(error){
    console.log('There was an error deleting the routine activity', error)
    throw error
  }

}

// async function canEditRoutineActivity(routineActivityId, userId) {} (Not in the project guide (yet)-CL

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  // canEditRoutineActivity,
};
