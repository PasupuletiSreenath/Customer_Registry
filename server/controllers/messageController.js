const Message = require("../models/Message");
const Complaint = require("../models/Complaint");

// @route POST /api/messages/:complaintId
// @desc  Send a message on a complaint thread (customer, assigned agent, or admin)
const sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { complaintId } = req.params;

    if (!content) {
      return res.status(400).json({ success: false, message: "Message content is required" });
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    const isOwner = complaint.customer.toString() === req.user._id.toString();
    const isAssignedAgent = complaint.assignedAgent && complaint.assignedAgent.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAssignedAgent && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied to this complaint thread" });
    }

    const message = await Message.create({
      complaint: complaintId,
      sender: req.user._id,
      senderRole: req.user.role,
      content,
    });

    res.status(201).json({ success: true, message: "Message sent", data: message });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/messages/:complaintId
// @desc  Get full message thread for a complaint
const getMessages = async (req, res, next) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    const isOwner = complaint.customer.toString() === req.user._id.toString();
    const isAssignedAgent = complaint.assignedAgent && complaint.assignedAgent.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAssignedAgent && !isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied to this complaint thread" });
    }

    const messages = await Message.find({ complaint: complaintId })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: messages.length, messages });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, getMessages };
