const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { createAndSaveUser, fetchUsers, User } = require("./model/User");
const { createExercise, Exercise } = require("./model/Exercise");

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res) => {
  try {
    const userName = req.body.username;
    const createdUser = await createAndSaveUser(userName);

    res.json({
      username: createdUser.username,
      _id: createdUser._id,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const allUsers = await fetchUsers();
    console.log("ALL USERS", allUsers);
    res.json(allUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    const id = req.params._id;
    const { description, duration, date } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const exerciseDate = date ? new Date(date) : new Date();

    const exercise = await createExercise({
      description,
      duration: Number(duration),
      date: exerciseDate,
      _id: id,
    });

    res.json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
      _id: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create an exercise" });
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    const id = req.params._id;
    const { from, to, limit } = req.query;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let query = { userId: id };

    if (from || to) {
      query.date = {};
      if (from) {
        query.date.$gte = new Date(from);
      }
      if (to) {
        query.date.$lte = new Date(to);
      }
    }

    let exerciseQuery = Exercise.find(query).sort({ date: 1 });

    if (limit) {
      exerciseQuery = exerciseQuery.limit(Number(limit));
    }

    const exercises = await exerciseQuery;

    const log = exercises.map((e) => ({
      description: e.description,
      duration: e.duration,
      date: e.date.toDateString(),
    }));

    res.json({
      username: user.username,
      count: log.length,
      _id: user._id,
      log,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
