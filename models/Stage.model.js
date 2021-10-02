const { Schema, model, Mongoose } = require("mongoose");

const stageSchema = new Schema({
  name: {
    type: String,
    // unique: true,
  },
  jobs: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
});

const Stage = model("Stage", stageSchema);

module.exports = Stage;
