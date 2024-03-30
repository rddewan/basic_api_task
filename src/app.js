const express = require('express');
const morgan = require('morgan')
const HttpStatusCode = require('./utils/httpStatusCode.js');
const { getAllTasks, getTask, createTask, patchTask, pustTask, deleteTask } = require('./controllers/taskController.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./utils/globalErrorHandler.js');


dotenv.config({
    path: './.env'
});

// express app
const app = express();


app.use(express.json());

// milldeware - morgan
app.use(morgan('common'));

// custom middleware
app.use((req, res, next) => {   
    req.requestTime = new Date().toISOString();
    next();
});

// express env
// console.log(app.get('env'));
// node env
// console.log(process.env);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/v1/tasks', getAllTasks);

app.get('/api/v1/tasks/:id/:dest?/:place?',  getTask);

app.post('/api/v1/tasks', createTask);

app.patch('/api/v1/tasks/:id', patchTask);

app.delete('/api/v1/tasks/:id', deleteTask);

app.all('*', (req, res, next) => {
    // res.status(HttpStatusCode.NOT_FOUND).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server`
    // })

    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.statusCode = HttpStatusCode.NOT_FOUND;
    // err.status = 'fail';
    
    next(new AppError(`Can't find ${req.originalUrl} on this server`, HttpStatusCode.NOT_FOUND));
})

// error handler - middleware
app.use(globalErrorHandler)

// setup the DB connection String
const DB = process.env.MONGO_DB_CONNECTION.replace('<PASSWORD>', process.env.MONGO_DB_PASSWORD);
// connect to the mongo db
mongoose.connect(DB)
    .then(() => console.log('DB connection successful!'))
    .catch(err => console.log(err)
);

app.listen(3000, () => console.log('Listening on port 3000'));