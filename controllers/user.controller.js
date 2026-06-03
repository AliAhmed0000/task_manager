const User = require('../models/user.model');

const httpStatusText = require('../utils/httpStatusText');

const {validationResult} = require('express-validator');

const asyncWrapper = require('../middlewares/asyncWrapper');

const appError = require('../utils/appError');

const { getUser } = require('../../session8/controllers/users.controller');

const bcrypt = require('bcryptjs');

const generateJWT = require('../../session8/utils/generateJWT');
// get tasks
const getAllUsers = asyncWrapper( async(req,res) => {
    
    const users = await taskUsers.find();
    return res.status(200).json({status: httpStatusText.SUCCESS, data: users});
})

// add a user
const register = asyncWrapper(async(req,res,next) => {
    // const {title, status, dueDate, description} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.ERROR);
        return next(error);
    }

    const {firstName, lastName, email, password} = req.body;    

    const newUser = new User({
        firstName,
        lastName,
        email,
        password:await bcrypt.hash(password, 10),
    });

    const token = await generateJWT({email: newUser.email, id:newUser._id});

    newUser.token = token;

    await newUser.save();

    return res.status(201).json({status: httpStatusText.SUCCESS, data : {user: newUser}});
})

// edit a task
const login = asyncWrapper(async(req,res,next) => {
    const {email, password} = req.body;

    const user = await User.findOne({email: email});
    if(!user) {
        const error = appError.create('user not found', 404, httpStatusText.FAIL);
        return next(error);
    }

    const matchedPassword = bcrypt.compare(password, user.password);

    if(!matchedPassword) {
        const error = appError.create('email or password incorrect', 401, httpStatusText.ERROR);
        return next(error);
    }
    const token = await generateJWT({email: email, id: user._id});
    user.token = token;

    return res.json({status: httpStatusText.SUCCESS, data:{token: token}});
})

// delete a task
/*
const deleteUser = asyncWrapper( async(req,res,next) => {
    const taskId = req.params.taskId;
    const task = Task.findById(taskId);

    if(!task){
        const error = appError.create('Task not found', 404, httpStatusText.ERROR);
        return next(error);
    }

    await Task.deleteOne(taskId);
    return res.status(201).json({status: httpStatusText.SUCCESS, data: {newTask: task}})
})
    */

module.exports = {
    getAllUsers,
    register,
    login
    // getUser
}