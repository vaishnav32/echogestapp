import express from "express";
import DeviceCommand from "../models/DeviceCommand.js";

const router = express.Router();

/* =====================================================
   GET /api/devices/commands/:deviceId
   ESP32 polling endpoint
===================================================== */
router.get("/commands/:deviceId", async (req, res) => {
  try {
    const { deviceId } = req.params;

    if (!deviceId) {
      return res.status(400).json({
        message: "deviceId is required",
      });
    }

    // Get oldest unexecuted command
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/* =====================================================
   POST /api/devices/ack
   ESP32 acknowledges execution
===================================================== */
router.post("/ack", async (req, res) => {
  try {
    const { commandId } = req.body;

    if (!commandId) {
      return res.status(400).json({
        message: "commandId is required",
      });
    }

    const command = await DeviceCommand.findById(commandId);

    if (!command) {
      return res.status(404).json({
        message: "Command not found",
      });
    }

    command.executed = true;
    command.executedAt = new Date();
    await command.save();

    res.json({
      message: "Command acknowledged",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;




