const express = require('express');

const mongoose = require('mongoose');

const httpStatusText = require('./utils/httpStatusText');

require('dotenv').config();

const url = process.env.MONGO_URL;

mongoose.connect(url).then(() => {
    console.log('mongodb connected');
})

const app = express();

app.use(express.json());

const tasksRouter = require('./routers/tasks.route');
const usersRouter = require('./routers/users.route');

app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);
// global middleware for not found routes
app.all('/*splat', (req,res,next) => {
    return res.status(404).json({status: httpStatusText.ERROR, message: "this resource is not available"});
    // return res.statusCode(404).json({msg:'not found'})
});

app.use((error,req,res,next) => {
    // res.status(500).json({status: httpStatusText.ERROR, message: error.message});
    res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data: null});
})

app.listen(process.env.PORT || 4000, () => {
    console.log('listening on port: 4000')
});
