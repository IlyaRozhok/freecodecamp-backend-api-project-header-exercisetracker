const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

const createAndSaveUser = async (userName) => {
  const user = new User({ username: userName });
  return await user.save();
};

module.exports = {
  User,
  createAndSaveUser,
};
