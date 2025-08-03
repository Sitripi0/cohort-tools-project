const express = require("express");
const router = express.Router();
const Cohort = require("../models/cohorts-model")

// GET /api/cohorts | Returns all the cohorts in JSON format 
router.get("/api/cohorts", (req, res, next) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);
      res.status(200).json(cohorts);
    })
    .catch(next);
});

// GET `/api/cohorts/:cohortId` | Returns the specified cohort by id 
router.get("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params
  Cohort.findById(cohortId)
    .then((cohort) => {
      res.status(200).json(cohort)
    })
    .catch(next);
});

// POST `/api/cohorts` |JSON| Creates a new cohort 
router.post("/api/cohorts", (req, res, next) => {
  Cohort.create({
    cohortSlug: req.body.cohortSlug,
    cohortName: req.body.cohortName,
    program: req.body.program,
    campus: req.body.campus,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    inProgress: req.body.inProgress,
    programManager: req.body.programManager,
    leadTeacher: req.body.leadTeacher,
    totalHours: req.body.totalHours
  })
    .then((createdCohort) => {
      res.status(201).json(createdCohort);
    })
    .catch(next);
});

// PUT `/api/cohorts/:cohortId`|JSON| Updates the specified cohort by id 
router.put("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params
  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      res.status(200).json(updatedCohort)
    })
    .catch(next);
});

// DELETE `/api/cohorts/:cohortId`| Deletes the specified cohort by id
router.delete("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params
  Cohort.findByIdAndDelete(cohortId)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
});

module.exports = router;