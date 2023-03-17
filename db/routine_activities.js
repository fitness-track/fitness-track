const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration
}) {
  console.log("Running addActivityToRoutine in db\routine_activities.js");
  try {
    const { rows: [ routine_activity ] } = await client.query(`
      INSERT INTO routine_activities(routineId, activityId, count, duration)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `, [routineId, activityId, count, duration]);

    console.log("Exiting addActivityToRoutine in db\routine_activities.js");
    return routine_activity;

  }catch(err){
    console.error("Error in addActivityToRoutine in db\routine_activities.js", err);
  }
}

async function getRoutineActivityById(id) {}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
