import express from "express";
import Gesture from "../models/Gesture.js";
import GestureMapping from "../models/GestureMapping.js";
import DeviceCommand from "../models/DeviceCommand.js";

const router = express.Router();

/* =====================================================
   POST /api/gestures
   Raspberry Pi sends detected gesture
===================================================== */
router.post("/", async (req, res) => {
  try {
    const { controllerId, gesture, confidence, source } = req.body;

    if (!controllerId || !gesture) {
      return res.status(400).json({
        message: "controllerId and gesture are required",
      });
    }

    // Save gesture log
    await Gesture.create({
      controllerId,
      gesture,
      confidence:
        typeof confidence === "number" ? confidence : null,
      source: source || "unknown",
      timestamp: new Date(),
    });

    // Find mapping
    const mapping = await GestureMapping.findOne({
      controllerId,
      gesture,
    });

    if (!mapping) {
      return res.json({
        message: "Gesture stored, but no mapping found",
      });
    }

    // Create command (ACK enabled)
    await DeviceCommand.create({
      controllerId,
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
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;





