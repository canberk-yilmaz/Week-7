const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 60,
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "viewer", "editor", "user"],
      message: "{VALUE} is not supported",
    },
    default: "user",
  },
});

module.exports = mongoose.model("User", userSchema);
