const Note = require("../models/note.model");

const createNote = async ({ title, content, userId, isFavorite, tags }) => {
  // Added isFavorite and tags to the creation process
  const note = await Note.create({
    title,
    content,
    isFavorite: isFavorite || false,
    tags: tags || ['Personal'],
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

// Make sure isPinned is inside this object argument!
// Inside note.service.js
const updateNote = async ({
  noteId,
  title,
  content,
  isFavorite,
  tags,
  isDeleted,
  isPinned,
  userId,
}) => {
  const note = await Note.findOne({ _id: noteId, user: userId });

  if (!note) {
    const error = new Error("Note not found");
    error.statusCode = 404;
    throw error;
  }

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  if (isFavorite !== undefined) note.isFavorite = isFavorite;
  if (tags !== undefined) note.tags = tags;
  if (isDeleted !== undefined) note.isDeleted = isDeleted;
  if (isPinned !== undefined) note.isPinned = isPinned;

  await note.save();
  return note;
};



// Permanent Delete (used for "Delete Forever")
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