const HttpStatusCode = require('../utils/httpStatusCode');

const sendErrorDev = (err, req, res) => {
    err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        erroe: err,
        stackTrack: err.stack       
    }) 
}

const sendErrorProd = (err, req, res) => {
    
    if (err.isOperational) {
        err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
        err.status = err.status || 'error';
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,       
        })
    } else {
        res.status(err.statusCode).json({
            status: 'error',
            message: 'Something went very wrong!',       
        })

    }
}


const globalErrorHandler = (err, req, res, next) => {

    if (process.env.NODE_ENV === 'development') {

        sendErrorDev(err, req, res);
        
    } else if (process.env.NODE_ENV === 'production') {

        sendErrorProd(err, req, res);

    } else {

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,       
        })
    }
    
}


module.exports = globalErrorHandler;