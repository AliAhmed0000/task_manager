const express = require('express');

const usersController = require('../controllers/user.controller');

const {body, validationResult} = require('express-validator');

const router = express.Router();

// const {addTaskValidation} = require('../middlewares/validationSchema');

router.route('/')
        .get(usersController.getAllUsers);
        
router.route('/register')
        .post([
                body('firstName')
                        .notEmpty()
                        .withMessage('First Name is required')
                        .isLength({min:2})
                        .withMessage('first name is short'),
                body('lastName')
                        .notEmpty()
                        .withMessage('Last Name is required')
                        .isLength({min:2})
                        .withMessage('last name is short'),
                body('email')
                        .notEmpty()
                        .withMessage('Email is required'),
                body('password')
                        .isLength({min:4})
                        .withMessage('password too short')
                        .notEmpty()
                        .withMessage('password can\'t be empty')
        ],usersController.register);

router.route('/login')
        .post(usersController.login);

// Get a course by its id
// this ':' to make it dynamic
// router.get('/:userId', usersController.getUser)



module.exports = router;