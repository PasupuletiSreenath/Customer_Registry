const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");

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
   STATIC ROUTES FIRST
   Must come before /:id so Express doesn't treat
   "assigned" as an id param and call getComplaintById
========================= */

// GET /complaints        — customers see their own, agents see assigned, admins see all
router.get("/", protect, getComplaints);

// GET /complaints/assigned — kept for explicit agent use; same filter as getComplaints
// but returning this dedicated route makes the intent clear on the frontend.
// MUST be above /:id or it is shadowed and never reached.
router.get("/assigned", protect, restrictTo("agent"), getComplaints);

/* =========================
   CUSTOMER ROUTES
========================= */
router.post("/", protect, restrictTo("customer"), createComplaint);

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
   DYNAMIC PARAM ROUTES LAST
========================= */
router.get("/:id", protect, getComplaintById);

module.exports = router;