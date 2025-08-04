const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");
const Cohort = require("./models/cohorts-model")
const Student = require("./models/students-model")
const { errorHandler, notFoundHandler } = require("./error-handling/error-handling")
require("dotenv/config");

 // connecting Mongoose
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to Database:"${x.connections[0].name}`))
  .catch(error => console.error("Error Connecting to Mongo DB", error));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const cohorts = require("./cohorts.json");
const students = require("./students.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
app.use(cors({
  origin: ["http://localhost:5173"]
}));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES//
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
const cohortRouter = require("./routes/cohort-routes");
app.use("/",cohortRouter);
const studentsRouter = require("./routes/students-routes");
app.use("/",studentsRouter);
const authRoutes = require("./routes/auth.routes");
app.use("/",authRoutes);

//ERROR HANDLER MIDDLEWARE
app.use(errorHandler);
app.use(notFoundHandler); 

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
