const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: String,
  description: String,
  duration: Number,
  date: String
});

export const Exercise = mongoose.model("Exercise", exerciseSchema);

