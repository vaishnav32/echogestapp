import express from "express";
import Gesture from "../models/Gesture.js";
import GestureMapping from "../models/GestureMapping.js";
import { addCommand } from "../commandQueue.js";

const router = express.Router();

/* =========================================================
   POST /api/gestures
   Called by Raspberry Pi wearable
   - Stores gesture
   - Resolves mapping
   - Queues command for ESP32 (if mapped)
========================================================= */
router.post("/", async (req, res) => {
  try {
    const {
      controllerId,
      gesture,
      confidence,
      timestamp,
      source,
    } = req.body;

    if (!controllerId || !gesture) {
      return res.status(400).json({
        message: "controllerId and gesture are required",
      });
    }

    /* 1️⃣ Store gesture event */
    const gestureEvent = new Gesture({
      controllerId,
      gesture,
      confidence,
      timestamp,
      source,
    });

    await gestureEvent.save();

    /* 2️⃣ Look for gesture → appliance mapping */
    const mapping = await GestureMapping.findOne({
      controllerId,
      gesture,
    });

    /* 3️⃣ If mapping exists → queue command for ESP32 */
    if (mapping) {
      addCommand(mapping.deviceId, {
        appliance: mapping.appliance,
        action: mapping.action,
      });

      return res.json({
        message: "Gesture mapped and command queued",
        action: {
          deviceId: mapping.deviceId,
          appliance: mapping.appliance,
          action: mapping.action,
        },
      });
    }

    /* 4️⃣ No mapping found */
    res.json({
      message: "Gesture received, no mapping found",
    });
  } catch (error) {
    console.error("Gesture route error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   GET /api/gestures/:controllerId
   Fetch gesture logs for dashboard
========================================================= */
router.get("/:controllerId", async (req, res) => {
  try {
    const { controllerId } = req.params;

    const gestures = await Gesture.find({ controllerId })
      .sort({ createdAt: -1 });

    res.json(gestures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;



