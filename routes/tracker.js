const router = require("express").Router();

const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedInMiddleware = require("../middleware/isLoggedIn");
// Require of both Job and Stage models
const Job = require("../models/Job.model");
const Stage = require("../models/Stage.model");

// 001 TRACKER ROUTE
router.get("/", isLoggedInMiddleware, (req, res) => {
  // I need to update it to only find the user's stages
  Stage.find({ author: req.session.user._id })
    .populate("jobs")
    .then((stages) => {
      res.render("tracker/tracker", {
        stages: stages,
        userName: req.session.user.username,
        sharedId: req.session.user._id,
      });
    });
});

// 002 NEW JOB ROUTE
router.get("/new/stageName/:stageName", isLoggedInMiddleware, (req, res) => {
  console.log(req.params.stageName);
  res.render("tracker/new", {
    stageName: req.params.stageName,
  });
});

// 002 NEW JOB ROUTE
router.post("/new/create", isLoggedInMiddleware, (req, res) => {
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
    const jobId = createdJob._id;
    // Add the job id to
    // I need to update it to only find the user's stages
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
router.get("/stage/:stageId/job/:jobId", isLoggedInMiddleware, (req, res) => {
  // I need to update it to only find the user's stages
  // 001 I search for the the name of the stage
  Stage.find().then((stages) => {
    Stage.findById(req.params.stageId).then((stage) => {
      // 002 Then I find the information about the job
      Job.findById(req.params.jobId).then((job) => {
        console.log("STAGES");
        console.log(stages);
        const stagesWithoutCurrent = stages.filter(
          (elem) => elem.name !== stage.name
        );
        console.log("HERE");
        console.log(stage.name);
        console.log(stagesWithoutCurrent);
        res.render("tracker/detail", {
          stageId: req.params.stageId,
          jobId: req.params.jobId,
          stageName: stage.name,
          job: job,
          stages: stages,
          stagesWithoutCurrent: stagesWithoutCurrent,
        });
      });
    });
  });
});

// 004 EDIT ROUTE
router.get(
  "/stage/:stageId/job/:jobId/edit",
  isLoggedInMiddleware,
  (req, res) => {
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
  }
);

// 005 UPDATED ROUTE
router.get(
  "/stage/:stageId/job/:jobId/updated",
  isLoggedInMiddleware,
  (req, res) => {
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
  }
);

// 006 Quick Update
router.post(
  "/stage/:stageId/job/:jobId/quickUpdate",
  isLoggedInMiddleware,
  (req, res) => {
    console.log("QUICK UPDATE");
    // 1 - Guardamos el valor de ID del job
    const oldStageId = req.params.stageId;
    const jobId = req.params.jobId;
    const newStageId = req.body.stage;

    // 2 - Eliminamos el job del Stage en la bbdd
    Stage.updateOne({ _id: oldStageId }, { $pullAll: { jobs: [jobId] } })
      .then((success1) => {
        console.log(success1);
        // 3 - Añadimos el job al nuevo stage
        Stage.updateOne({ name: newStageId }, { $push: { jobs: [jobId] } })
          .then((success2) => {
            console.log(success2);
            res.redirect("/tracker");
          })
          .catch((error1) => {
            console.log(error1);
          });
      })
      .catch((error2) => {
        console.log(error2);
      });
  }
);

// 007 Add new stage
router.post("/newStage", isLoggedInMiddleware, (req, res) => {
  const { stageName } = req.body;
  //   console.log(req.body);
  //   console.log(stageName);
  Stage.create({ name: stageName, author: req.session.user._id })
    .then((success) => {
      res.redirect("/tracker");
    })
    .catch((err) => {
      console.log(err);
    });
});

// 008 Shared Tracker
router.get("/shared/:sharedId", (req, res) => {
  // I need to update it to only find the user's stages
  Stage.find({ author: req.params.sharedId })
    .populate("jobs")
    .then((stages) => {
      res.render("tracker/sharedTracker", {
        stages: stages,
        sharedId: req.params.sharedId,
      });
    });
});

// 009 Shared tracker Detail
router.get("/shared/:sharedId/stage/:stageId/job/:jobId", (req, res) => {
  // I need to update it to only find the user's stages
  // 001 I search for the the name of the stage
  Stage.find().then((stages) => {
    Stage.findById(req.params.stageId).then((stage) => {
      // 002 Then I find the information about the job
      Job.findById(req.params.jobId).then((job) => {
        const stagesWithoutCurrent = stages.filter(
          (elem) => elem.name !== stage.name
        );
        res.render("tracker/sharedDetail", {
          stageId: req.params.stageId,
          jobId: req.params.jobId,
          sharedId: req.params.sharedId,
          stageName: stage.name,
          job: job,
          stages: stages,
          stagesWithoutCurrent: stagesWithoutCurrent,
        });
      });
    });
  });
});

module.exports = router;
