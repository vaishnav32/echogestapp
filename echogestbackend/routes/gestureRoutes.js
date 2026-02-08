import express from "express";
import Gesture from "../models/Gesture.js";
import GestureMapping from "../models/GestureMapping.js";
import DeviceCommand from "../models/DeviceCommand.js";

const router = express.Router();

/* ======================================================
   POST /api/gestures
   Raspberry Pi sends recognized gesture
====================================================== */
router.post("/", async (req, res) => {
  try {
    const { controllerId, gesture, confidence, source } = req.body;

    if (!controllerId || !gesture) {
      return res.status(400).json({
        message: "controllerId and gesture are required",
      });
    }

    // 1️⃣ Store gesture event
    const gestureEvent = await Gesture.create({
      controllerId,
      gesture,
      confidence,
      source,
      timestamp: new Date(),
    });

    // 2️⃣ Find mapping for this gesture + controller
    const mapping = await GestureMapping.findOne({
      controllerId,
      gesture,
    });

    // 3️⃣ If mapping exists → create device command
    if (mapping) {
      await DeviceCommand.create({
        controllerId,                 // ✅ FIX (THIS WAS MISSING)
        deviceId: mapping.deviceId,
        appliance: mapping.appliance,
        action: mapping.action,
      });

      return res.json({
        message: "Gesture mapped and command queued",
        command: {
          controllerId,
          deviceId: mapping.deviceId,
          appliance: mapping.appliance,
          action: mapping.action,
        },
      });
    }

    // 4️⃣ No mapping → gesture logged only
    res.json({
      message: "Gesture received (no mapping found)",
      gesture: gestureEvent,
    });
  } catch (error) {
    console.error("Gesture error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;




