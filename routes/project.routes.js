const router = require("express").Router();
const Project = require("../models/Project.model");
const mongoose = require("mongoose");

// POST /projects
router.post("/projects", (req, res, next) => {
  // const {title, price} = req.body;
  const { title, description } = req.body;

  Project.create({ title, description })
    .then((projectFromDB) => {
      console.log("Project created:", projectFromDB);
      res.status(201).json(projectFromDB);
    })
    .catch((e) => {
      console.log("Error creating a new project");
      console.log(e);
      res.status(500).json({ message: "Error creating a new project" });
    });
});

// GET /projects
router.get("/projects", (req, res, next) => {
  Project.find()
    .populate("tasks")
    .then((projectsFromDB) => {
      res.json(projectsFromDB);
    })
    .catch((e) => {
      console.log("Error getting list of projects");
      console.log(e);
      res.status(500).json({ message: "Error getting list of projects" });
    });
});

// GET /projects/:projectTitle
router.get("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  // validate projectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findById(projectId)
  .populate("tasks")
    .then((projectDetails) => {
      res.json(projectDetails);
    })
    .catch((e) => {
      console.log("Error getting project details");
      console.log(e);
      res.status(500).json({ message: "Error getting project details" });
    });
});

// Update Project
router.put("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  
  // validate projectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const { title, description } = req.body;

  Project.findByIdAndUpdate(projectId, { title, description }, { new: true })
  .populate("tasks")
    .then((result) => {
      res.status(200).json({ message: "Updated", result });
    })
    .catch((err) => {
      res.status(500).json("Error during updating");
    });
});

// delete

router.delete("/projects/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  // validate projectId
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Project.findByIdAndDelete(projectId)
    .then((result) => {
      res.status(204).json({ message: "Successfully deleted" });
    })
    .catch((err) => {
      res.status(500).json("Error during deleting");
    });
});

module.exports = router;
