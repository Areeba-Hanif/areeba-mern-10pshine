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




module.exports = {
  createNote,
  getUserNotes,
};
