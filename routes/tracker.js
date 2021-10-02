const router = require("express").Router();

const isLoggedOut = require("../middleware/isLoggedOut");
// Require of both Job and Stage models
const Job = require("../models/Job.model");
const Stage = require("../models/Stage.model");

router.get("/", (req, res) => {
  Stage.find()
    .populate("jobs")
    .then((stages) => {
      // job populating stage
      res.render("tracker/tracker", { stages: stages });
    });
});

router.get("/new", (req, res) => {
  res.render("tracker/new");
});

router.get("/stage/:stageId/job/:jobId", (req, res) => {
  console.log(req.params);
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
