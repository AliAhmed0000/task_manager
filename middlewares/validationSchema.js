const {body} = require('express-validator');

const addTaskValidation = () => {
        return [
body('title')
        .notEmpty()
        .withMessage('title is required')
        .isLength({min:2})
        .withMessage('title is short'),
body('status')
        .notEmpty()
        .withMessage('status is required')
        .isIn(['pending','in-progress','done'])
        .withMessage('Status value must be pending,in-progress or done'),
body('dueDate')
        .optional()
        .isISO8601() // YYYY-MM-DD
        .withMessage('Due date format must be YYYY-MM-DD')
        .toDate() // to convert this string to a real date
        .custom((value) => { // custom validation
                const today = new Date(); //get today's date
                // const givenDate = new Date(value);

                today.setHours(0,0,0,0);

                if(value < today){
                        throw new Error('Due date must be today or in the future')
                }
                return true;
        })
]}

module.exports = {addTaskValidation};

