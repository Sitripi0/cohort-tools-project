const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");
const Cohort = require("../models/cohorts-model")
const Student = require("../models/students-model")

// connecting Mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Database:"${x.connections[0].name}`))
  .catch(error => console.error("Error Connecting to Mongo DB", error));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
// const cohorts = require("./cohorts.json");
// const students = require("./students.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors({
  origin: ["http://localhost:5173"]
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// app.get("/api/cohorts",(req,res,next)=>{
//   res.json(cohorts);
// });
// app.get("/api/students",(req,res,next)=>{
//   res.json(students);
// });

//COHORT ROUTES//

// | GET | `/api/cohorts` | (empty) | Returns all the cohorts in JSON format |
app.get("/api/cohorts", (req, res, next) => {

  Cohort.find({})

    .then((cohorts) => {
      console.log("Retrieved cohorts ->", cohorts);
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});
// | GET | `/api/cohorts/:cohortId` | (empty) | Returns the specified cohort by id |
app.get("/api/cohorts/:cohortId", (req, res, next) => {

  Cohort.findById(req.params.cohortId)
    .then((cohort) => {
      res.status(200).json(cohort)
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts byID ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});
// | POST | `/api/cohorts` | JSON | Creates a new cohort |
app.post("/api/cohorts", (req, res, next) => {

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
    .then()
    .catch((err) => {
      res.status(500).json({ message: "Error creating newRecipe" })
    })
});
// | PUT | `/api/cohorts/:cohortId` | JSON | Updates the specified cohort by id |
app.put("/api/cohorts/:cohortId", (req, res, next) => {

  Cohort.findByIdAndUpdate(req.params.cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      res.status(200).json(updatedCohort)
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating Cohort by Id" })
    })

});
// | DELETE | `/api/cohorts/:cohortId` | (empty) | Deletes the specified cohort by id |
app.delete("/api/cohorts/:cohortId", (req, res, next) => {

  Cohort.findByIdAndDelete(req.params.cohortId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      res.status(500).json({ message: "Error deleting Cohort by Id." })
    });
});

//STUDENT ROUTES//

// | GET | `/api/students` | (empty) | Returns all the students in JSON format
app.get("/api/students", (req, res, next) => {

  Student.find({})
    .then((students) => {
      console.log("Retrieved students ->", students);
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});
//   GET | `/api/students/cohort/:cohortId` | (empty) | Returns all the students of a specified cohort in JSON format |
app.get("/api/students/cohort/:cohortId", (req, res, next) => {

  Student.find(req.params.cohortId)
    .then((students) => {
      res.status(200).json(students);
    })
    .catch((error) => {
      console.error("Error getting  students by cohort ->", error);
      res.status(500).json({ error: "Error getting students by cohort" });
    });
});
// | GET | `/api/students/:studentId` | (empty) | Returns the specified student by id |
app.get("/api/students/:studentId", (req, res, next) => {

  Student.findById(req.params.studentId)
    .then((student) => {
      res.status(200).json(student)
    })
    .catch((error) => {
      console.error("Error getting  student by ID ->", error);
      res.status(500).json({ error: "Error getting student by ID" });
    });
});

// | POST | `/api/students` | JSON | Creates a new student **with their respective cohort id ** |
app.post("/api/students", (req, res, next) => {

  Student.create({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    phone:req.body.phone,
    linkedinUrl:req.body.linkedinUrl,
    languages:req.body.languages,
    program:req.body.program,
    background:req.body.background,
    image:req.body.image,
    cohort:req.body.cohort,
    projects:req.body.projects   
  })
    .then((createdStudent) => {
      res.status(201).json(createdStudent);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error creating newStudent"})
    })
});

// | PUT | `/api/students/:studentId` | JSON | Updates the specified student by id |
app.put("/api/students/:studentId", (req, res, next) => {

  Student.findByIdAndUpdate(req.params.studentId,req.body,{new:true})
        .then((updateStudent) => {
            res.status(200).json(updateStudent)
        })

        .catch((err) => {
            res.status(500).json({ message: "Error updating Student by Id." })
        });
});
// | DELETE | `/api/students/:studentId` | (empty) | Deletes the specified cohort by id |
app.delete("/api/students/:studentId", (req, res, next) => {

    Student.findByIdAndDelete(req.params.studentId)
        .then(() => {
            res.status(204).send();
        })
        .catch((err) => {
            res.status(500).json({ message: "Error deleting Student by Id." })
        });
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
