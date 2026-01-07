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


const updateNote = async ({ noteId, title, content, userId }) => {
  const note = await Note.findById(noteId);

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  if (note.user.toString() !== userId.toString()) {
    const error = new Error("Not authorized to update this note");
    error.statusCode = 403;
    throw error;
  }

  note.title = title || note.title;
  note.content = content || note.content;

  await note.save();
  return note;
};

const deleteNote = async ({ noteId, userId }) => {
  const note = await Note.findById(noteId);

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  if (note.user.toString() !== userId.toString()) {
    const error = new Error("Not authorized to delete this note");
    error.statusCode = 403;
    throw error;
  }

  await note.deleteOne();
  return note;
};



module.exports = {
  createNote,
  getUserNotes,
  updateNote,
  deleteNote
};
