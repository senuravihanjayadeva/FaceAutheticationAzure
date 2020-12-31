const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //it will automatically create fields when it wasa created or modified
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
