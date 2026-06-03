const Task = require('../models/task.model');

const httpStatusText = require('../utils/httpStatusText');

const {validationResult} = require('express-validator');

const asyncWrapper = require('../middlewares/asyncWrapper');

const appError = require('../utils/appError');
// get tasks
const getAllTasks = asyncWrapper( async(req,res) => {
    
    const status = req.query.status;
    let filter = {};
    if(status){
        filter.status = {$in : status.split(",")};
    }
    
    filter.owner = req.currentUser.id;
    // console.log(filter)

    console.log("filter is:",filter);
    
    const tasks = await Task.find(filter);
    return res.status(200).json({status: httpStatusText.SUCCESS, data: tasks});
})
// get pending task
/*const getUnfinishedTasks = async(req,res) => {
    const tasks = await Task.find({status: {$in:["pending","in-progress"]}});
    res.status(200).json({status: httpStatusText.SUCCESS, data: tasks});
}*/
// add a task
const addTask = asyncWrapper(async(req,res,next) => {
    // const {title, status, dueDate, description} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.ERROR);
        return next(error);
    }
    const newtask = new Task(req.body);
    newtask.owner = req.currentUser.id;

    await newtask.save();
    return res.status(201).json({status: httpStatusText.SUCCESS, data: {newTask: newtask}})
})

// edit a task
const editTask = asyncWrapper(async(req,res,next) => {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);

    if(!task){
        const error = appError.create('Task not found', 404, httpStatusText.ERROR);
        return next(error);
    }

    const updatedTask = await Task.updateOne({_id: taskId}, {$set: {...req.body}});
    return res.status(201).json({status: httpStatusText.SUCCESS, data: {newTask: updatedTask}})
})

// delete a task
const deleteTask = asyncWrapper( async(req,res,next) => {
    const taskId = req.params.taskId;
    const task = Task.findById(taskId);

    if(!task){
        const error = appError.create('Task not found', 404, httpStatusText.ERROR);
        return next(error);
    }

    await Task.deleteOne(taskId);
    return res.status(201).json({status: httpStatusText.SUCCESS, data: {newTask: task}})
})

module.exports = {
    getAllTasks,
    addTask,
    editTask,
    deleteTask
}