import express from "express";
import DeviceCommand from "../models/DeviceCommand.js";
import mongoose from "mongoose";

const router = express.Router();

/* ===============================
   GET: ESP32 Polling
================================ */
router.get("/commands/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;

    if (!deviceId) {
      return res.status(400).json({ message: "deviceId is required" });
    }

    const command = await DeviceCommand.findOne({
      deviceId,
      executed: false,
    }).sort({ createdAt: 1 });

    if (!command) {
      return res.json({ command: null });
    }

    res.json({
      command: {
        id: command._id,
        appliance: command.appliance,
        action: command.action,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ===============================
   POST: ACK
================================ */
router.post("/ack", async (req, res) => {
  try {
    const { commandId } = req.body;

    if (!commandId) {
      return res.status(400).json({ message: "commandId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(commandId)) {
      return res.status(400).json({ message: "Invalid commandId" });
    }

    const command = await DeviceCommand.findById(commandId);

    if (!command) {
      return res.status(404).json({ message: "Command not found" });
    }

    command.executed = true;
    command.executedAt = new Date();
    await command.save();

    res.json({ message: "Command acknowledged" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/* ✅ THIS LINE IS REQUIRED */
export default router;






