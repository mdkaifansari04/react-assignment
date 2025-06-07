const MeetingHistory = require("../../model/schema/meeting");
const mongoose = require("mongoose");
const User = require("../../model/schema/user");

const add = async (req, res) => {
  try {
    const { attendes, attendesLead, agenda, location, related, notes } = req.body;

    if (!agenda) {
      return res.status(400).json({ error: "Agenda is required" });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(400).json({ error: "User not found" });

    const result = new MeetingHistory({
      attendes,
      attendesLead,
      agenda,
      location,
      related,
      notes,
      createBy: user._id,
    });

    await result.save();
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to create :", err);
    res.status(400).json({ err, error: "Failed to create" });
  }
};

const index = async (req, res) => {
  try {
    const result = await MeetingHistory.find({});
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to get :", err);
    res.status(400).json({ err, error: "Failed to get" });
  }
};

const view = async (req, res) => {
  try {
    const result = await MeetingHistory.findById(req.params.id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to get :", err);
    res.status(400).json({ err, error: "Failed to get" });
  }
};

const deleteData = async (req, res) => {
  try {
    const result = await MeetingHistory.findById(req.params.id);
    if (!result) return res.status(400).json({ error: "Meeting not found" });
    result.deleted = true;
    await result.save();
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to delete :", err);
    res.status(400).json({ err, error: "Failed to delete" });
  }
};

const deleteMany = async (req, res) => {
  try {
    const result = await MeetingHistory.updateMany({ _id: { $in: req.body } }, { $set: { deleted: true } }); 
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to delete :", err);
    res.status(400).json({ err, error: "Failed to delete" });
  }
};

module.exports = { add, index, view, deleteData, deleteMany };
