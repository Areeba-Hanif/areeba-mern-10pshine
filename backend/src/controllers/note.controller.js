const { createNote, getUserNotes } = require("../services/note.service");
const logger = require("../utils/logger");

const create = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      const error = new Error("Title and content are required");
      error.statusCode = 400;
      throw error;
    }

    const note = await createNote({
      title,
      content,
      userId: req.user._id,
    });

    logger.info(`Note created by user ${req.user._id}`);

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};
const getAll = async (req, res, next) => {
  try {
    const { search, from, to } = req.query;

    const notes = await getUserNotes({
      userId: req.user._id,
      search,
      from,
      to,
    });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  create,
  getAll,
};
