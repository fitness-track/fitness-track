/* eslint-disable no-useless-catch */
const express = require("express");
const bcrypt = require("bcrypt")
const { getUserByUsername, createUser, getUser, getAllRoutinesByUser } = require("../db");
const { UserTakenError, PasswordTooShortError, UnauthorizedError } = require("../errors");
const usersRouter = express.Router();

const jwt = require('jsonwebtoken');
const jwt_secret = "neverTell"


// POST /api/users/register
usersRouter.post('/register', async (req, res, next) =>{
    const { username, password } = req.body;
    console.log("starting to register new user - users.js/api")

    try {
        let user = await getUserByUsername(username);

        if(user) {
            console.log("Error, this user exists", user)
            const errorMessage = UserTakenError(username)
            const duplicateUserError = {
                message: errorMessage,
                name: username,
                error: "UserExistsError"
            }
            res.send(duplicateUserError);
            // res.send(UserTakenError(username));
            // next({
            //     name: 'UserExistsError',
            //     message: "A user by that username already exists and our database isn't that good silly goose"
            // });
        }
        
        if(password.length<8) {
            console.log("Password too short", password)
            const errorMessage = PasswordTooShortError()
            const tooShortError = {
                error: "PasswordTooShortError",
                message: errorMessage,
                name: username,
            }
            res.send(tooShortError);
        }

            user = await createUser({
                username, password
            });

            const token = jwt.sign({id: user.id, username}, jwt_secret, { expiresIn: '1w' });

            res.send({ message: 'thank you for signing up', token, user});
        } catch( {name, message }){
            next({ name, message });
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
    console.log("/api/users/login username and password:", username, password)
    
    if (!username || !password) {
    res.send({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
    });
    }

    try {
        const _user = await getUserByUsername(username);
        console.log("Username response from getUserByUsername: ", _user)
        let hashedPass = _user.password
        let match = await bcrypt.compare(password, hashedPass)
        
        if (match) {
            const token = jwt.sign({ 
            id: _user.id, 
            username
            }, jwt_secret, {
            expiresIn: '1w'
            });
            const user = {id: _user.id, username: _user.username}
            res.send({message: "you're logged in!", user, token});

        } else {
            res.send({ 
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

        res.send(user);
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
