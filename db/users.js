const client = require("./client");
// database functions

// user functions
async function createUser({ username, password }) {
 console.log("starting CreateUser")
 const SALT_COUNT = 10;
 const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
 
  try{
    const{ rows: [user] }= await client.query(`
    INSERT INTO users(username, 
    password),
    VALUES($1, $2)
    RETURN *; 
    `, [username, hashedPassword])
    return user;
  }catch{
    console.log("error creating user");
    throw error;
  }
}

async function getUser({ username, password }) {
  try{
  const user = await getUserByUsername(username);
  const hashedPassword = user.password;
  const passwordsMatch = await bcrypt.compare(password, hashedPassword)
  
  // try{
  //   const {rows: [user]} = await client.query(`
  //   SELECT id, username, password FROM users WHERE ;
  //   `)
  //   return user;
  // }catch{
  //   console.log("error getting user");
  //   throw error;
  // }
 
  if(passwordsMatch){
    return user;
  }}catch(error){
    throw error
  }
}


async function getUserById(userId) {
  console.log("starting getUserById")
  try{
  const {rows: [user] }= await client.query(`
  SELECT ${user} FROM users WHERE id=${userId};`)
    return user;

  }catch{
    console.log("error getting user by id");
    throw error;
  }
}

async function getUserByUsername(username) {
  console.log("Starting to getUserByUsername")

  try{
    const {rows:[user]} = await client.query(`
    SELECT ${user} FROM users WHERE username =${username};`)
    return user;

  }catch{
    console.log("error getting user by username")
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
