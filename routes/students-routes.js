const express = require ("express");
const router = express.Router();
const Student = require("../models/students-model");


// GET `/api/students`| Returns all the students in JSON format
router.get("/api/students", (req, res, next) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch(next);
});

// GET `/api/students/cohort/:cohortId`| Returns all the students of a specified cohort in JSON format
router.get("/api/students/cohort/:cohortId", (req, res, next) => {
  const { cohortId } = req.params
  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((students) => {
      res.status(200).json(students);
    })
    .catch(next);
});

// GET `/api/students/:studentId`| Returns the specified student by id
router.get("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params
  Student.findById(studentId)
    .populate("cohort")
    .then((student) => {
      res.status(200).json(student)
    })
    .catch(next);
});

// POST `/api/students`|JSON|Creates a new student **with their respective cohort id
router.post("/api/students", (req, res, next) => {
  Student.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    linkedinUrl: req.body.linkedinUrl,
    languages: req.body.languages,
    program: req.body.program,
    background: req.body.background,
    image: req.body.image,
    cohort: req.body.cohort,
    projects: req.body.projects
  })
    .then((createdStudent) => {
      res.status(201).json(createdStudent);
    })
    .catch(next);
});

// PUT `/api/students/:studentId`|JSON|Updates the specified student by id
router.put("/api/students/:studentId", (req, res, next) => {
  Student.findByIdAndUpdate(req.params.studentId, req.body, { new: true })
    .then((updateStudent) => {
      res.status(200).json(updateStudent)
    })
    .catch(next);
});

// DELETE `/api/students/:studentId`|Deletes the specified cohort by id
router.delete("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params
  Student.findByIdAndDelete(studentId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
});

module.exports = router;