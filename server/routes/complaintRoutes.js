const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
  submitFeedback,
  deleteComplaint,
} = require("../controllers/complaintController");

// Customer creates a complaint; all roles can list/view per their own scope (handled in controller)
router.post("/", protect, restrictTo("customer"), createComplaint);
router.get("/", protect, getComplaints);
router.get("/:id", protect, getComplaintById);

// Admin assigns complaints to agents
router.put("/:id/assign", protect, restrictTo("admin"), assignComplaint);

// Agent or admin updates status
router.put("/:id/status", protect, restrictTo("agent", "admin"), updateComplaintStatus);

// Customer submits feedback/rating after resolution
router.put("/:id/feedback", protect, restrictTo("customer"), submitFeedback);

// Admin deletes a complaint record
router.delete("/:id", protect, restrictTo("admin"), deleteComplaint);

module.exports = router;
