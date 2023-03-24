const express = require('express');
const router = express.Router();

const {
    getAllActivities,
    getActivityById,
    getActivityByName,
    attachActivitiesToRoutines,
    createActivity,
    updateActivity,
    getRoutineActivityById,
} = require('../db');


// GET /api/activities/:activityId/routines

activitiesRouter.get('/', async (req,res,next) =>{
    const {activityId} = req.params;
    try{
        const activities = await getRoutineActivityById(activityId);
        res.send({
            activities
        })
    }catch({activities}){
        console.log('There was an error using the GET activities router')
        next({activities})
    }
    

})
// GET /api/activities

activitiesRouter.get('/', async (req,res,next) =>{
    try{
        const activities = await getAllActivities();
        res.send({
            activities
        })
    }catch({activities}){
        console.log('There was an error using the GET activities router')
        next({activities})
    }
    });

// POST /api/activities

activitiesRouter.post('/', async (req,res,next) =>{
    const {name, description = ""} = req.body
    const activityData = {}
    try{
        activityData.name=name;
        activityData.description=description;

        const activities = await createActivity(activityData);
        res.send({
           message:'Activity created!', activities
        })
    }catch({activities}){
        console.log('There was en error in the POST activities router')
        next({activities})
    }

    });
// PATCH /api/activities/:activityId

activitiesRouter.patch('/', async (req,res,next) =>{
    const { id, name, description } = req.body
    const updateFields = {}
    try{
        updateFields.id = id;
        updateFields.name = name;
        updateFields.description = description;

        const activities = await updateActivity(updateFields);
        res.send({
            activities
        })
    }catch({activities}){
        console.log('There was a error in the PATCH acitivies router')
        next({activities})
    }
    });

module.exports = router;
