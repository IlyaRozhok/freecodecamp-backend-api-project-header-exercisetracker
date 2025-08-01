const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  username: { type: String },
  count: { type: Number },
  log: [
    {
      description: { type: String },
      duration: { type: Number },
      date: { type: String },
    },
  ],
});

const Log = new mongoose.Model("Log", logSchema)