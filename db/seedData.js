// require in the database adapter functions as you write them (createUser, createActivity...)
// const { } = require('./');
const client = require("./client")

async function dropTables() {
  console.log("Dropping All Tables - db/seedData.js")
  try{
    await client.query(`
    drop table if exists routine_activities;
    drop table if exists routines;
    drop table if exists activities;
    drop table if exists users;   
    `)
    console.log("Successfully dropped all tables - db/seedData.js")
  // drop all tables, in the correct order
  }catch(err){
    console.log(err, "There was an error dropping tables - db/seedData.js")
    throw err
  } 
}

async function createTables() {
  // TODO: Hash password for users table
  // TODO: Lowercase all entries being added into activities
  console.log("Starting to build tables - db/seedData.js")
  try{
    await client.query(`
    create table users (
      id serial primary key,
      username varchar(255) unique not null,
      password varchar(255) not null
    );

    create table activities (
      id serial primary key,
      name varchar(255) unique not null,
      description text not null
    );

    create table routines (
      id serial primary key,
      "creatorId" integer references users(id),
      "isPublic" boolean default false,
      name varchar(255) unique not null,
      goal text not null
    );

    create table routine_activities (
      id serial primary key,
      "routineId" integer references routines(id),
      "activityId" integer references activities(id),
      unique ("routineId", "activityId"),
      duration integer,
      count integer
    );
    `)

    console.log("Successfully created tables! - db/seedData.js")
  }catch(err){
    console.log(err, "There was an error creating tables - db/seedData.js")
    throw err
  }
}
  // create all tables, in the correct order

/* 

DO NOT CHANGE ANYTHING BELOW. This is default seed data, and will help you start testing, before getting to the tests. 

*/

async function createInitialUsers() {
  console.log("Starting to create users...")
  try {
    const usersToCreate = [
      { username: "albert", password: "bertie99" },
      { username: "sandra", password: "sandra123" },
      { username: "glamgal", password: "glamgal123" },
    ]
    const users = await Promise.all(usersToCreate.map(createUser))

    console.log("Users created:")
    console.log(users)
    console.log("Finished creating users!")
  } catch (error) {
    console.error("Error creating users!")
    throw error
  }
}
async function createInitialActivities() {
  try {
    console.log("Starting to create activities...")

    const activitiesToCreate = [
      {
        name: "wide-grip standing barbell curl",
        description: "Lift that barbell!",
      },
      {
        name: "Incline Dumbbell Hammer Curl",
        description:
          "Lie down face up on an incline bench and lift thee barbells slowly upward toward chest",
      },
      {
        name: "bench press",
        description: "Lift a safe amount, but push yourself!",
      },
      { name: "Push Ups", description: "Pretty sure you know what to do!" },
      { name: "squats", description: "Heavy lifting." },
      { name: "treadmill", description: "running" },
      { name: "stairs", description: "climb those stairs" },
    ]
    const activities = await Promise.all(activitiesToCreate.map(createActivity))

    console.log("activities created:")
    console.log(activities)

    console.log("Finished creating activities!")
  } catch (error) {
    console.error("Error creating activities!")
    throw error
  }
}

async function createInitialRoutines() {
  console.log("starting to create routines...")

  const routinesToCreate = [
    {
      creatorId: 2,
      isPublic: false,
      name: "Bicep Day",
      goal: "Work the Back and Biceps.",
    },
    {
      creatorId: 1,
      isPublic: true,
      name: "Chest Day",
      goal: "To beef up the Chest and Triceps!",
    },
    {
      creatorId: 1,
      isPublic: false,
      name: "Leg Day",
      goal: "Running, stairs, squats",
    },
    {
      creatorId: 2,
      isPublic: true,
      name: "Cardio Day",
      goal: "Running, stairs. Stuff that gets your heart pumping!",
    },
  ]
  const routines = await Promise.all(
    routinesToCreate.map((routine) => createRoutine(routine))
  )
  console.log("Routines Created: ", routines)
  console.log("Finished creating routines.")
}

async function createInitialRoutineActivities() {
  console.log("starting to create routine_activities...")
  const [bicepRoutine, chestRoutine, legRoutine, cardioRoutine] =
    await getRoutinesWithoutActivities()
  const [bicep1, bicep2, chest1, chest2, leg1, leg2, leg3] =
    await getAllActivities()

  const routineActivitiesToCreate = [
    {
      routineId: bicepRoutine.id,
      activityId: bicep1.id,
      count: 10,
      duration: 5,
    },
    {
      routineId: bicepRoutine.id,
      activityId: bicep2.id,
      count: 10,
      duration: 8,
    },
    {
      routineId: chestRoutine.id,
      activityId: chest1.id,
      count: 10,
      duration: 8,
    },
    {
      routineId: chestRoutine.id,
      activityId: chest2.id,
      count: 10,
      duration: 7,
    },
    {
      routineId: legRoutine.id,
      activityId: leg1.id,
      count: 10,
      duration: 9,
    },
    {
      routineId: legRoutine.id,
      activityId: leg2.id,
      count: 10,
      duration: 10,
    },
    {
      routineId: legRoutine.id,
      activityId: leg3.id,
      count: 10,
      duration: 7,
    },
    {
      routineId: cardioRoutine.id,
      activityId: leg2.id,
      count: 10,
      duration: 10,
    },
    {
      routineId: cardioRoutine.id,
      activityId: leg3.id,
      count: 10,
      duration: 15,
    },
  ]
  const routineActivities = await Promise.all(
    routineActivitiesToCreate.map(addActivityToRoutine)
  )
  console.log("routine_activities created: ", routineActivities)
  console.log("Finished creating routine_activities!")
}

async function rebuildDB() {
  try {
    await dropTables()
    await createTables()
    await createInitialUsers()
    await createInitialActivities()
    await createInitialRoutines()
    await createInitialRoutineActivities()
  } catch (error) {
    console.log("Error during rebuildDB")
    throw error
  }
}

module.exports = {
  rebuildDB,
  dropTables,
  createTables,
}
