const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isFavorite: { 
    type: Boolean,
    default: false
   },
   isDeleted: {
    type: Boolean,
    default: false 
  },
isPinned: { type: Boolean, default: false },
    tags: {
    type: [String],
    default: ['Personal'] }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", noteSchema);
