const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  description: { type: String },
  duration: { type: Number },
  date: { type: String },
  _id: { type: String },
});

const Exercise = mongoose.model("Exercise", exerciseSchema);

const createExercise = async (exercise) => {
  const date = exercise.date ?? new Date().toDateString();
  const createdExercise = new Exercise({ ...exercise, date });
  return await createdExercise.save();
};

module.exports = {
  createExercise,
};
