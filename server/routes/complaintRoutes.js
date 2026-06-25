const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

const Complaint = require("../models/Complaint");

const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  assignComplaint,
  updateComplaintStatus,
  submitFeedback,
  deleteComplaint,
} = require("../controllers/complaintController");

/* =========================
   CUSTOMER ROUTES
========================= */
router.post("/", protect, restrictTo("customer"), createComplaint);

router.get("/", protect, getComplaints);

router.get("/:id", protect, getComplaintById);

router.put("/:id", protect, restrictTo("customer"), updateComplaint);

router.put("/:id/feedback", protect, restrictTo("customer"), submitFeedback);

router.delete("/:id", protect, restrictTo("customer", "admin"), deleteComplaint);

/* =========================
   ADMIN ROUTES
========================= */
router.put("/:id/assign", protect, restrictTo("admin"), assignComplaint);

/* =========================
   AGENT ROUTES
========================= */
router.put(
  "/:id/status",
  protect,
  restrictTo("agent", "admin"),
  updateComplaintStatus
);

/* =========================
   GET ASSIGNED COMPLAINTS (AGENT)
========================= */
router.get("/assigned", protect, restrictTo("agent"), async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    console.log("Agent ID:", userId);

    const complaints = await Complaint.find({
      assignedAgent: userId,
    })
      .populate("customer", "name email")
      .populate("assignedAgent", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      complaints,
    });

  } catch (err) {
    console.log("ASSIGNED ROUTE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;