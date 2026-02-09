const express = require("express");

const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// 1. Imports
const { protect } = require("../middlewares/auth.middleware"); 
const { create, getAll, update, remove, getOne} = require("../controllers/note.controller");

// 2. Route Definitions
router.post("/", protect, create);
router.get("/", protect, getAll);
router.put("/:id", protect, update);
router.delete("/:id", protect, remove);
router.get("/:id", protect, getOne);


module.exports = router;
