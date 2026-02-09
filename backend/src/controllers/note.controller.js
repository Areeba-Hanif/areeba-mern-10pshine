const { createNote, getUserNotes, updateNote, deleteNote, getNoteById, } = require("../services/note.service");
const logger = require("../utils/logger");

const create = async (req, res, next) => {
  try {
    // 1. Added isFavorite and tags to the destructuring
    const { title, content, isFavorite, tags } = req.body;

    if (!title || !content) {
      const error = new Error("Title and content are required");
      error.statusCode = 400;
      throw error;
    }

    const note = await createNote({
      title,
      content,
      isFavorite: isFavorite || false, // Pass the new field
      tags: tags || ['Personal'],      // Pass the new field
      userId: req.user._id,
    });

    logger.info({ userId: req.user._id }, "Note created");

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    // 1. You MUST add isPinned here to extract it from the frontend request
    const { title, content, isFavorite, tags, isDeleted, isPinned } = req.body;

    const updatedNote = await updateNote({
      noteId: id,
      title,
      content,
      isFavorite,
      tags,
      isDeleted,
      isPinned, // 2. Pass it into the service call
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      data: updatedNote,
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

const getOne = async (req, res, next) => {
  try {
    const note = await getNoteById({
      noteId: req.params.id,
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};


const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedNote = await deleteNote({
      noteId: id,
      userId: req.user._id,
    });

    logger.info({ noteId: id, userId: req.user._id }, "Note deleted");


    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: deletedNote,
    });
  } catch (error) {
    next(error);
  }
};




module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove,
 

};
