import express from "express";
import Gesture from "../models/Gesture.js";
import GestureMapping from "../models/GestureMapping.js";
import DeviceCommand from "../models/DeviceCommand.js";

const router = express.Router();

/* =========================================
   POST /api/gestures
   Called by Raspberry Pi wearable
========================================= */
router.post("/", async (req, res) => {
  try {
    const { controllerId, gesture, confidence, timestamp, source } = req.body;

    if (!controllerId || !gesture) {
      return res.status(400).json({
        message: "controllerId and gesture are required",
      });
    }

    // Save gesture log
    await Gesture.create({
      controllerId,
      gesture,
      confidence,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      source,
    });

    // Find mapping
    const mapping = await GestureMapping.findOne({
      controllerId,
      gesture,
    });

    if (!mapping) {
      return res.json({
        message: "Gesture recorded (no mapping)",
      });
    }

    // 🔥 STORE COMMAND IN DB (NOT MEMORY)
    await DeviceCommand.create({
      deviceId: mapping.deviceId,
      appliance: mapping.appliance,
      action: mapping.action,
    });

    res.json({
      message: "Gesture mapped and command queued",
      action: {
        deviceId: mapping.deviceId,
        appliance: mapping.appliance,
        action: mapping.action,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;



