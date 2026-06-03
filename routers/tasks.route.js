const express = require('express');

const tasksController = require('../controllers/task.controller');

const {body, validationResult} = require('express-validator');

const router = express.Router();

const {addTaskValidation} = require('../middlewares/validationSchema');

const verifyToken = require('../middlewares/verifyToken');

router.route('/')
        .get(verifyToken(), tasksController.getAllTasks)
        .post(addTaskValidation(), verifyToken(),tasksController.addTask);

router.route('/:taskId')
        .patch(tasksController.editTask)
        .delete(tasksController.deleteTask)



module.exports = router;