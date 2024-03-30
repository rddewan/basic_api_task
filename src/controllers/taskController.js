const { trusted } = require('mongoose');
const Task = require('../models/taskModel');
const HttpStatusCode = require('../utils/httpStatusCode');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const tasks = [
    {
        id: 1,
        text: 'Doctor Appointment',
        day: 'Feb 5th at 2:30pm',
        reminder: true
    },
    {
        id: 2,
        text: 'Meeting at School',
        day: 'Feb 6th at 1:30pm',
        reminder: true
    },
    {
        id: 3,
        text: 'Food Shopping',
        day: 'Feb 5th at 2:30pm',
        reminder: false

    },
    {
        id: 4,
        text: 'Sent Email',
        day: 'Feb 5th at 2:30pm',
        reminder: false
    },
    {
        id: 5,
        text: 'Buy Milk',
        day: 'Feb 5th at 2:30pm',
        reminder: false
    },
    {
        id: 6,
        text: 'Goto Gym',
        day: 'Feb 5th at 2:30pm',
        reminder: false
    }
]


const getAllTasks = catchAsync(async (req, res, next) => {

    const query = Task.find({});
    const result = await query.select('-__v');

    res.status(HttpStatusCode.OK).json({
        status: 'success',
        results: result.length,
        data: {
            tasks: result
        } 
        
    })
   
})

const getTask = catchAsync(async (req, res, next) => {   

    const taskId = req.params.id;
    const query = Task.findById(taskId);
    const task = await query.select('-__v')
    if(!task) return next(new AppError('No Task found with that ID', HttpStatusCode.NOT_FOUND));
        
        
    res.status(HttpStatusCode.OK).json({
        status: 'success',
        results: 1, 
        requestTime: req.requestTime,       
        data: {
            task
        }        
    })
})

const createTask = catchAsync(async (req, res, next) => {
    const body = req.body;
    const newTask = await Task.create({
        text: body.text,
        day: body.day,
        reminder: body.reminder
    })

    res.status(HttpStatusCode.CREATED).json({
        status: 'success',        
        data: {
            task: newTask
        }        
    })
})

const patchTask = catchAsync(async (req, res, next) => {

    const taskId = req.params.id;
    const task = await Task.findByIdAndUpdate(taskId, req.body, {
        new: true,
    }).catch(next(new AppError('No Task found with that ID', HttpStatusCode.NOT_FOUND)));  
   

    res.status(HttpStatusCode.OK).json({
        status: 'success',        
        data: {
            task
        }        
    })
    
})


const deleteTask = catchAsync(async (req, res, next) => {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId)
        .catch(next(new AppError('No Task found with that ID', HttpStatusCode.NOT_FOUND)));
    
    res.status(HttpStatusCode.NO_CONTENT).json({
        status: 'success',        
        data: null        
    })
    
})

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    patchTask,
    deleteTask
}