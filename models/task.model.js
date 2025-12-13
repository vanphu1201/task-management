const { default: mongoose } = require("mongoose");

const tasktSchema = new mongoose.Schema(
    {
        title: String,
        status: String,
        content: String,
        timeStart: Date,
        timeFinish: Date,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
);

const Task = mongoose.model('Task', tasktSchema, "tasks")


module.exports = Task;