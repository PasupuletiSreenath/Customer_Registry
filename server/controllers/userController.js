const User = require("../models/User");

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

module.exports = { getMyProfile, updateMyProfile, getAllUsers, getUserById, updateUserStatus };
