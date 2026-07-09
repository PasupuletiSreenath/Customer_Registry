const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
  getAllUsers,
  getUserById,
  updateUserStatus,
  createAgent,
  deleteUser,
} = require("../controllers/userController");

// Logged-in user's own profile
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.put("/me/password", protect, updateMyPassword);

// Admin-only user management
router.get("/", protect, restrictTo("admin"), getAllUsers);
router.post("/agent", protect, restrictTo("admin"), createAgent);
router.get("/:id", protect, restrictTo("admin"), getUserById);
router.put("/:id/status", protect, restrictTo("admin"), updateUserStatus);
router.delete("/:id", protect, restrictTo("admin"), deleteUser);

module.exports = router;