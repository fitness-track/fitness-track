/* eslint-disable no-useless-catch */
const express = require("express");
const { getUserByUsername, createUser, getUser, getAllRoutinesByUser } = require("../db");
const usersRouter = express.Router();

const jwt = require('jsonwebtoken');
const jwt_secret = "verysecretive"


// POST /api/users/register
usersRouter.post('/register', async (req, res, next) =>{
    const { username, password } = req.body;
    console.log("starting to register new user - users.js/api")

    try {
        let user = await getUserByUsername(username);

        if(user) {
            next({
                name: 'UserExistsError',
                message: "A user by that username already exists and our database isn't that good silly goose"
            });
        } else {

            user = await createUser({
                username, password
            });

            const token = jwt.sign({id: user.id, username}, jwt_secret, { expiresIn: '1w' });

            res.send({ message: 'thank you for signing up', token});
        }
    }catch(err){
        console.log("error registering user.  Error: ", err)
        next();
    }
});

// try {
//     const response = await fetch(`${BASE_URL}/users/register`, {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             user: {
//                 username: '',
//                 password: '',
//             }
//         })
//     })
//     const result = await response.json();
//     console.log("finished registering new user - users.js/api");
//     console.log("result: ", result);
//     return result;
// }catch(err){
//     console.log("error registering new user - users.js/api");
//     throw err;
// }



// POST /api/users/login
usersRouter.post('/login', async(req, res, next) => {
    const { username, password } = req.body;
    console.log("Starting to login user in api/users.js")
    if (!username || !password) {
    next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
    });
    }

    try {
    const user = await getUserByUsername(username);

        if (user && user.password == password) {
            const token = jwt.sign({ 
            id: user.id, 
            username
            }, jwt_secret, {
            expiresIn: '1w'
            });

            res.send({ 
            message: "you're logged in!",
            token 
            });
        } else {
            next({ 
            name: 'IncorrectCredentialsError', 
            message: 'Username or password is incorrect'
            });
        }
    } catch(error) {
    console.log("error logging user in api/users.js", error);
    throw(error);
    }
});

// GET /api/users/me
usersRouter.get('/me', async(req, res, next) => {
    const { username, password } = req.body;
    try{
        const user = await getUser({username, password});

        res.send({
            user
        });
    }catch(err){
        console.log("error getting user at api/users.js", err)
        next();
    }
})

// GET /api/users/:username/routines
usersRouter.get("/:username/routine", async (req, res, next) => {
    const { password } = req.body;
    const { username } = req.params;
    if(username && username.password == password ) {
        try{
            const myData = await getAllRoutinesByUser({username});

            res.send({
                myData
            })
        }catch(error){
            console.log("error getting routines within username at api/users.js", error);
            throw error;
        }

    }else{
        next()
    }
})


module.exports = usersRouter;
