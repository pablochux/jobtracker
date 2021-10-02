const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const jobSchema = new Schema({
  companyName: String,
  url: String,
  position: String,
  salary: Number,
  location: String,
  remote: String, // will be hybrid, on campus or remote
  notes: String,
});

const Job = model("Job", jobSchema);

module.exports = Job;
