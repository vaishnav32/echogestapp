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

    // ✅ ONLY validate deviceId
    if (!deviceId) {
      return res.status(400).json({
        message: "deviceId is required",
      });
    }

    // ✅ Fetch latest command
    const command = await DeviceCommand.findOne({ deviceId })
      .sort({ createdAt: -1 });

    // ✅ IMPORTANT: return null if no command
    if (!command) {
      return res.json({
        command: null,
      });
    }

    // ✅ Return command
    res.json({
      command: {
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

export default router;



