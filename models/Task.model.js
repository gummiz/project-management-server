const mongoose = require("mongoose")
const { Schema, model } = mongoose

const taskSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    projectId:  {type: mongoose.Schema.Types.ObjectId, ref: "Project" }
})

module.exports = model("Task", taskSchema)