const Note = require("../models/note.model");

const createNote = async ({ title, content, userId }) => {
  const note = await Note.create({
    title,
    content,
    user: userId,
  });

  return note;
};

const getUserNotes = async (userId) => {
  const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
  return notes;
};


module.exports = {
  createNote,
  getUserNotes,
};
