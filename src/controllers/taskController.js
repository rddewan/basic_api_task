const { trusted } = require('mongoose');
const Task = require('../models/taskModel');
const HttpStatusCode = require('../utils/httpStatusCode');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


const getAllTasks = catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    const query = Task.find({}).skip(skip).limit(limit);
    const result = await query.select('-__v');
    const total = await Task.countDocuments();
    const toatlPage = Math.ceil(total / limit);
    const currentPage = page;

    res.status(HttpStatusCode.OK).json({
        status: 'success',
        total: total,
        toatlPage: toatlPage,
        currentPage: currentPage,
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
    });

    res.status(HttpStatusCode.OK).json({
        status: 'success',        
        data: {
            task
        }        
    })
    
})


const deleteTask = catchAsync(async (req, res, next) => {
    const taskId = req.params.id;
    const task = await Task.findByIdAndDelete(taskId);

    
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