const { createNote, getUserNotes, updateNote, deleteNote,  } = require("../services/note.service");const logger = require("../utils/logger");

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
    const notes = await getUserNotes(req.user._id);

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title && !content) {
      const error = new Error("Nothing to update");
      error.statusCode = 400;
      throw error;
    }

    const updatedNote = await updateNote({
      noteId: id,
      title,
      content,
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
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
  update,
  remove,
  

};
