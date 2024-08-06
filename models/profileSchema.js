const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userID: { type: String, require: true, unique: true },
  serverID: { type: String, require: true },
  kloudCoins: { type: Number, default: 1 },
  dailyLastUsed: {type: Number, default: 0},
});

const model = mongoose.model("klouddb", profileSchema);

module.exports = model;
