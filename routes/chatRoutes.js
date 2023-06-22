const express = require("express");
const { protect } = require("../middleware/AuthMiddleWare");
const {
  createChat,
  fetchChat,
  createGroupChat,
  renameGroupName,
  addToGroup,
  removeFromGroup,
} = require("../controllers/ChatController");
const router = express.Router();

router.route("/").post(protect, createChat);
router.route("/").get(protect, fetchChat);
router.route("/group").post(protect, createGroupChat);
router.route("/rename-group").put(protect, renameGroupName);
router.route("/add-member").put(protect, addToGroup);
router.route("/remove-from-group").put(protect, removeFromGroup);

module.exports = router;
