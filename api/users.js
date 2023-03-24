/* eslint-disable no-useless-catch */
const express = require("express");
const { getUserByUsername, createUser, getUser, } = require("../db");
const router = express.Router();

const { 
  createUser,
  getAllUsers,
  getUserByUsername,
} = require('../db');

const jwt = require('jsonwebtoken');



// POST /api/users/register
usersRouter.post('/register', async (req, res, next) =>{
    const { username, password } = req.body;


    console.log("starting to register new user - users.js/api")


    try {
        const_user = await getUserByUsername(username);

        if(_user) {
            next({
                name: 'UserExistsError',
                message: "A user by that username already exists and our database isn't that good silly goose"
            });
        }

        const user = await createUser({
            username, password
        });

        const token = jwt.sign({id: user.id, username
        }, process.env.JWT_SECRET, { expiresIn: '1w' });

        res.send({ message: 'thank you for signing up', token});
    }catch(err){
        console.log("error registering user")
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
        }, process.env.JWT_SECRET, {
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
    console.log("error loggin user in api/users.js", error);
    throw(error);
    }
});

// GET /api/users/me
usersRouter.get('/', async(req, res, next) => {
    try{
        const user = await getUser({username, password});

        res.send({
            user
        });
    }catch(err){
        console.log("error getting user at api/users.js", err)
        throw (err);
    }
})

// GET /api/users/:username/routines

module.exports = router;
