import express from "express";
import Gesture from "../models/Gesture.js";
import GestureMapping from "../models/GestureMapping.js";
import DeviceCommand from "../models/DeviceCommand.js";

const router = express.Router();

/* =====================================================
   POST /api/gestures
===================================================== */
router.post("/", async (req, res) => {
  try {
    const { controllerId, gesture, confidence, source } = req.body;

    if (!controllerId || !gesture) {
      return res.status(400).json({
        message: "controllerId and gesture are required",
      });
    }

    // Save gesture
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

    // Create command
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
  } catch (err) {
    console.error("GESTURE POST ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* =====================================================
   GET /api/gestures/:controllerId
   (WITH DATE FILTER SUPPORT)
===================================================== */
router.get("/:controllerId", async (req, res) => {
  try {
    const { controllerId } = req.params;
    const { from, to } = req.query;

    const query = { controllerId };

    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const gestures = await Gesture.find(query).sort({
      timestamp: -1,
    });

    res.json(gestures);
  } catch (err) {
    console.error("GESTURE GET ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;






