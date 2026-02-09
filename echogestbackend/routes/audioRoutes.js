import express from "express";
import AudioEvent from "../models/AudioEvent.js";

const router = express.Router();

/* =====================================================
   POST /api/audio
   Raspberry Pi sends audio classification
===================================================== */
router.post("/", async (req, res) => {
  try {
    const { controllerId, sound, confidence, source } = req.body;

    if (!controllerId || !sound) {
      return res.status(400).json({
        message: "controllerId and sound are required",
      });
    }

    await AudioEvent.create({
      controllerId,
      sound,
      confidence:
        typeof confidence === "number" ? confidence : null,
      source: source || "yamnet",
      timestamp: new Date(),
    });

    res.json({ message: "Audio event stored" });
  } catch (error) {
    console.error("Audio POST error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* =====================================================
   GET /api/audio/:controllerId
   With optional date filters
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

    const audioEvents = await AudioEvent.find(query).sort({
      timestamp: -1,
    });

    res.json(audioEvents);
  } catch (error) {
    console.error("Audio GET error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;


