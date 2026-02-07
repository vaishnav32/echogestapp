import express from "express";
import AudioEvent from "../models/AudioEvent.js";

const router = express.Router();

/* --------------------------------------------------
   POST: Receive audio event from Raspberry Pi wearable
---------------------------------------------------*/
router.post("/", async (req, res) => {
  try {
    const { controllerId, sound, confidence, source } = req.body;

    if (!controllerId || !sound) {
      return res.status(400).json({
        message: "controllerId and sound are required",
      });
    }

    const newAudio = new AudioEvent({
      controllerId,
      sound,
      confidence,
      source,
      timestamp: new Date(),
    });

    await newAudio.save();

    res.status(201).json({
      message: "Audio event saved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* --------------------------------------------------
   GET: Fetch audio events by controllerId
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

    const audioEvents = await AudioEvent.find(query)
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(audioEvents);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;


