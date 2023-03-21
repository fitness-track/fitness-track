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
      SELECT id, "routineId", "activityId", duration, count,
      FROM routine_activities
      WHERE id=${id}
    `);

    if (!routineActivity){
      return null
    }
    console.log('Finished getting routine activity by id')
    return routineActivity
  }catch(error){
    console.log('Error getting routine activities by id', error)
    throw error
  }
}

// async function getRoutineActivitiesByRoutine({ id }) {}

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

// async function destroyRoutineActivity(id) {}

// async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  // getRoutineActivityById,
  addActivityToRoutine,
  // getRoutineActivitiesByRoutine,
  // updateRoutineActivity,
  // destroyRoutineActivity,
  // canEditRoutineActivity,
};
