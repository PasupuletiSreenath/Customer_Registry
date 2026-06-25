const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
  getUserById,
  updateUserStatus,
} = require("../controllers/userController");

// Logged-in user's own profile
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);

// Admin-only user management
router.get("/", protect, restrictTo("admin"), getAllUsers);
router.get("/:id", protect, restrictTo("admin"), getUserById);
router.put("/:id/status", protect, restrictTo("admin"), updateUserStatus);

module.exports = router;
