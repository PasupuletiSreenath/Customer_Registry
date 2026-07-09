const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { sendMessage, getMessages } = require("../controllers/messageController");

router.post("/:complaintId", protect, sendMessage);
router.get("/:complaintId", protect, getMessages);

module.exports = router;
