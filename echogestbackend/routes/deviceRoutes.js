import express from "express";
import DeviceCommand from "../models/DeviceCommand.js";

const router = express.Router();

/* ======================================================
   GET /api/devices/commands/:deviceId
   ESP32 polls for next command
====================================================== */
router.get("/commands/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;

    const command = await DeviceCommand.findOne({
      deviceId,
      executed: false,
    }).sort({ createdAt: 1 });

    if (!command) {
      return res.json({ command: null });
    }

    // Mark as executed
    command.executed = true;
    await command.save();

    res.json({
      appliance: command.appliance,
      action: command.action,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


