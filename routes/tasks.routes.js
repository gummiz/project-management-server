const router = require("express").Router();
const Task = require("../models/Task.model");
const Project = require("../models/Project.model");

const mongoose = require("mongoose");

router.post("/tasks", async (req, res, next) => {
  const { title, description, projectId } = req.body;

  const newTask = {
    title: title,
    description: description,
    project: projectId,
  };

  try {
    const traskFromDB = await Task.create(newTask)
    const projectFromDB = await Project.findByIdAndUpdate(projectId, { $push: {tasks: traskFromDB._id}})
    res.status(201).json(traskFromDB)
  } catch(e) {
    console.log("Error creating new task");
    console.log(e)
    res.status(500).json({message: "Error creating new task"})
  }

//   Task.create({ title, description, project: projectId })

//     .then((addTask) => {
//       console.log(addTask);
//       return Project.findByIdAndUpdate(projectId, {
//         $push: { tasks: addTask_id },
//       });
//     })
//     .then((task) => {
//       res.status(201).json(task);
//     })
//     .catch((err) => {
//       console.log("Error creating task");
//       res.status(500).json(err);
//     });
});

module.exports = router;
