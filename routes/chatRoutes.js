const express = require("express");
const { protect } = require("../middleware/AuthMiddleWare");
const { createChat } = require("../controllers/ChatController");
const router = express.Router();

router.route("/").post(protect, createChat);
// router.route("/").get(protect, fetchChat);
// router.route("/group").post(protect, createGroupChat);
// router.route("/rename-group").put(protect, renameGroupName);
// router.route("/add-member").put(protect, addToGroup);

module.exports = router;