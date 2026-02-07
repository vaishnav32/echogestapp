import express from "express";
import Gesture from "../models/Gesture.js";

const router = express.Router();

/* --------------------------------------------------
   POST: Receive gesture from Raspberry Pi wearable
---------------------------------------------------*/
router.post("/", async (req, res) => {
  try {
    const { controllerId, gesture, confidence, source } = req.body;

    if (!controllerId || !gesture) {
      return res.status(400).json({
        message: "controllerId and gesture are required",
      });
    }

    const newGesture = new Gesture({
      controllerId,
      gesture,
      confidence,
      source,
      timestamp: new Date(),
    });

    await newGesture.save();

    res.status(201).json({
      message: "Gesture saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* --------------------------------------------------
   GET: Fetch gestures by controllerId
   Supports optional date-time filtering
---------------------------------------------------*/
router.get("/:controllerId", async (req, res) => {
  try {
    const { controllerId } = req.params;
    const { from, to } = req.query;

    const query = { controllerId };

    // Optional date filtering
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const gestures = await Gesture.find(query)
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(gestures);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;

