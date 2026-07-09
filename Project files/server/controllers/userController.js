const User = require("../models/User");
const bcrypt = require("bcryptjs");

// @route GET /api/users/me
// @desc  Get logged-in user's own profile
const getMyProfile = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/users/me
// @desc  Update logged-in user's own profile (name, phone, address)
const updateMyProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Profile updated", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/users/me/password
// @desc  Update logged-in user's password
const updateMyPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user and explicitly select password (since it's select: false in schema)
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect current password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/users
// @desc  Admin only -- list all users, optionally filtered by role
const getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};

    const users = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/users/:id
// @desc  Admin only -- get a single user's full profile
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/users/:id/status
// @desc  Admin only -- activate/deactivate a user account (e.g. an agent)
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User status updated", user });
  } catch (error) {
    next(error);
  }
};

// @route POST /api/users/agent
// @desc  Admin only -- create a new agent account (sets login credentials)
const createAgent = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "agent",
    });

    res.status(201).json({
      success: true,
      message: "Agent created",
      user: {
        id: agent._id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/users/:id
// @desc  Admin only -- delete a user account (e.g. an agent)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Set assignedAgent to null for all complaints assigned to this user
    const Complaint = require("../models/Complaint");
    await Complaint.updateMany(
      { assignedAgent: user._id },
      { $set: { assignedAgent: null, status: "open" } }
    );

    await user.deleteOne();

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  updateMyPassword,
  getAllUsers,
  getUserById,
  updateUserStatus,
  createAgent,
  deleteUser,
};