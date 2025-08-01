const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date },
    userId: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

const createExercise = async (exercise) => {
  const date = exercise.date ? new Date(exercise.date) : new Date();
  const { _id, ...exerciseData } = exercise; // Destructure to remove _id
  const createdExercise = new Exercise({
    ...exerciseData,
    date,
    userId: _id, // Use _id as userId, not as document _id
  });
  return await createdExercise.save();
};

module.exports = {
  createExercise,
  Exercise,
};
