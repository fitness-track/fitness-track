const express = require('express');
const router = express.Router();

const {
    getAllActivities,
    getActivityById,
    getActivityByName,
    attachActivitiesToRoutines,
    createActivity,
    updateActivity,
} = require('../db');

// GET /api/activities/:activityId/routines
activitiesRouter.get('/', async (req,res,next) =>{
    
    

})
// GET /api/activities
activitiesRouter.get('/', async (req,res,next) =>{
    try{
        const activities = await getAllActivities();
        res.send({
            activities
        })
    }catch({activities}){
        next({activities})
    }

    });
    
// POST /api/activities

// PATCH /api/activities/:activityId

module.exports = router;
