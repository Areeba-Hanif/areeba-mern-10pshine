const express = require("express");
const { create, getAll, update, remove } = require("../controllers/note.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// 1. Imports
const { protect } = require("../middlewares/auth.middleware"); 
const { create, getAll, update, remove } = require("../controllers/note.controller");

// 2. Route Definitions
router.post("/", protect, create);
router.get("/", protect, getAll);
router.put("/:id", protect, update);
router.delete("/:id", protect, remove);

module.exports = router;
