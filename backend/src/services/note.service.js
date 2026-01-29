const Note = require("../models/note.model");

const createNote = async ({ title, content, userId }) => {
  const note = await Note.create({
    title,
    content,
    user: userId,
  });

  return note;
};

const getUserNotes = async ({ userId, search, from, to }) => {
  const query = { user: userId };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  return await Note.find(query).sort({ createdAt: -1 });
};

const getNoteById = async ({ noteId, userId }) => {
  const note = await Note.findById(noteId);

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  if (note.user.toString() !== userId.toString()) {
    const error = new Error("Not authorized");
    error.statusCode = 403;
    throw error;
  }

  return note;
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

  return note;
};

const deleteNote = async ({ noteId, userId }) => {
  const note = await Note.findOneAndDelete({
    _id: noteId,
    user: userId, // ownership check ✅
  });

  return note;
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
  getNoteById,
  updateNote,
  deleteNote,
   
};
