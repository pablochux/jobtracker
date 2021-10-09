const router = require("express").Router();

const isLoggedOut = require("../middleware/isLoggedOut");
// Require of both Job and Stage models
const Job = require("../models/Job.model");
const Stage = require("../models/Stage.model");

// 001 TRACKER ROUTE
router.get("/", (req, res) => {
  Stage.find()
    .populate("jobs")
    .then((stages) => {
      // job populating stage
      res.render("tracker/tracker", { stages: stages });
    });
});

// 002 NEW JOB ROUTE
router.get("/new/stageName/:stageName", (req, res) => {
  console.log(req.params.stageName);
  res.render("tracker/new", {
    stageName: req.params.stageName,
  });
});

// 002 NEW JOB ROUTE
router.post("/new/create", (req, res) => {
  const { companyName, position, url, location, remote, salary, notes, stage } =
    req.body;
  console.log(req.body);
  Job.create({
    companyName,
    url,
    position,
    salary,
    location,
    remote,
    notes,
  }).then((createdJob) => {
    console.log(createdJob);
    console.log(stage);
    const jobId = createdJob._id;
    // Add the job id to
    Stage.updateOne({ name: stage }, { $push: { jobs: [jobId] } })
      .then((success) => {
        console.log(success);
      })
      .catch((error) => {
        console.log(error);
      });
    res.redirect("/tracker");
  });
});

// 003 DETAIL ROUTE
router.get("/stage/:stageId/job/:jobId", (req, res) => {
  // 001 I search for the the name of the stage
  Stage.findById(req.params.stageId).then((stage) => {
    // 002 Then I find the information about the job
    Job.findById(req.params.jobId).then((job) => {
      res.render("tracker/detail", {
        stageId: req.params.stageId,
        jobId: req.params.jobId,
        stageName: stage.name,
        job: job,
      });
    });
  });
});

// 004 EDIT ROUTE
router.get("/stage/:stageId/job/:jobId/edit", (req, res) => {
  console.log("In Edit view");
  Stage.findById(req.params.stageId).then((stage) => {
    // 002 Then I find the information about the job
    Job.findById(req.params.jobId).then((job) => {
      console.log(job);
      res.render("tracker/edit", {
        stageId: req.params.stageId,
        jobId: req.params.jobId,
        stageName: stage.name,
        job: job,
      });
    });
  });
});

// 005 UPDATED ROUTE
router.get("/stage/:stageId/job/:jobId/updated", (req, res) => {
  console.log(UPDATED);
  // 001 I search for the the name of the stage
  Stage.findById(req.params.stageId).then((stage) => {
    // 002 Then I find the information about the job
    Job.findById(req.params.jobId).then((job) => {
      console.log(job);
      res.render("tracker/detail", {
        stageId: req.params.stageId,
        jobId: req.params.jobId,
        stageName: stage.name,
        job: job,
      });
    });
  });
});

// localhost:3000/tracker/stage:id/job:id

module.exports = router;
