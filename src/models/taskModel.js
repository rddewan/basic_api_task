const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'Please add a text value'],
            unique: true
        },
        day: {
            type: Date,
            default: Date.now
        },
        reminder: {
            type: Boolean,
            required: [true, 'Please add a reminder value']
        },
    }, 
    {
        timestamps: true
    },
);
const Task = mongoose.model('Task', taskSchema);

module.exports = Task