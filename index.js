const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { createAndSaveUser, fetchUsers } = require("./model/User");

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

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
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
