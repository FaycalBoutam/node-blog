const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    required: true,
    default: 0,
  },
})

module.exports = mongoose.model("Post", postSchema)
