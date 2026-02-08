import express from "express";
import Gesture from "../models/Gesture.js";
import GestureMapping from "../models/GestureMapping.js";

const router = express.Router();

/* =========================================================
   POST /api/gestures
   Trigger gesture (from Raspberry Pi)
========================================================= */
router.post("/", async (req, res) => {
  try {
    const { controllerId, gesture, confidence } = req.body;

    if (!controllerId || !gesture) {
      return res.status(400).json({
        message: "controllerId and gesture are required",
      });
    }

    // 1️⃣ Save gesture event
    const event = new Gesture({
      controllerId,
      gesture,
      confidence,
    });

    await event.save();

    // 2️⃣ Find mapping
    const mapping = await GestureMapping.findOne({
      controllerId,
      gesture,
    });

    // 3️⃣ If mapped → decide action
    if (mapping) {
      return res.json({
        message: "Gesture mapped",
        action: {
          deviceId: mapping.deviceId,
          appliance: mapping.appliance,
          action: mapping.action,
        },
      });
    }

    // 4️⃣ No mapping
    res.json({
      message: "Gesture received, no mapping found",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   GET /api/gestures/:controllerId
========================================================= */
router.get("/:controllerId", async (req, res) => {
  try {
    const gestures = await Gesture.find({
      controllerId: req.params.controllerId,
    }).sort({ createdAt: -1 });

    res.json(gestures);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;



