const Complaint = require("../models/Complaint");

// @route POST /api/complaints
// @desc  Customer creates a new complaint
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const complaint = await Complaint.create({
      customer: req.user._id,
      title,
      description,
      category,
      priority,
    });

    res.status(201).json({ success: true, message: "Complaint submitted", complaint });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/complaints
// @desc  Role-aware list:
//        - customer: only their own complaints
//        - agent: only complaints assigned to them
//        - admin: all complaints (optionally filtered by status/agent via query)
const getComplaints = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === "customer") {
      filter.customer = req.user._id;
    } else if (req.user.role === "agent") {
      filter.assignedAgent = req.user._id;
    } else if (req.user.role === "admin") {
      if (req.query.status) filter.status = req.query.status;
      if (req.query.agent) filter.assignedAgent = req.query.agent;
    }

    const complaints = await Complaint.find(filter)
      .populate("customer", "name email")
      .populate("assignedAgent", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/complaints/:id
// @desc  Get a single complaint -- access restricted to owner customer, assigned agent, or admin
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("assignedAgent", "name email");

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    const isOwner = complaint.customer._id.toString() === req.user._id.toString();
    const isAssignedAgent =
      complaint.assignedAgent && complaint.assignedAgent._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAssignedAgent && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied to this complaint" });
    }

    res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/complaints/:id/assign
// @desc  Admin only -- assign a complaint to an agent
const assignComplaint = async (req, res, next) => {
  try {
    const { agentId } = req.body;
    if (!agentId) {
      return res.status(400).json({ success: false, message: "agentId is required" });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedAgent: agentId, status: "in-progress" },
      { new: true }
    ).populate("assignedAgent", "name email");

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({ success: true, message: "Complaint assigned", complaint });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/complaints/:id/status
// @desc  Agent or admin -- update complaint status (and resolution timestamp)
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["open", "in-progress", "escalated", "resolved", "closed"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const updateData = { status };
    if (status === "resolved") updateData.resolvedAt = new Date();

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({ success: true, message: "Complaint status updated", complaint });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/complaints/:id/feedback
// @desc  Customer only -- rate and leave feedback once complaint is resolved/closed
const submitFeedback = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    if (complaint.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You can only rate your own complaints" });
    }

    complaint.rating = rating;
    complaint.feedback = feedback;
    await complaint.save();

    res.status(200).json({ success: true, message: "Feedback submitted", complaint });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/complaints/:id
// @desc  Admin only -- delete a complaint record
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }
    res.status(200).json({ success: true, message: "Complaint deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
  submitFeedback,
  deleteComplaint,
};
