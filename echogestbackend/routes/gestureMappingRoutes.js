import express from "express";
import GestureMapping from "../models/GestureMapping.js";

const router = express.Router();

/* =====================================================
   POST /api/gesture-mappings
   Create a new gesture → appliance mapping
===================================================== */
router.post("/", async (req, res) => {
  try {
    let { controllerId, gesture, deviceId, appliance, action } = req.body;

    if (!controllerId || !gesture || !deviceId || !appliance || !action) {
      return res.status(400).json({
        message:
          "controllerId, gesture, deviceId, appliance and action are required",
      });
    }

    /* =========================
       NORMALIZE GESTURE
    ========================= */
    const normalizedGesture = gesture.trim().toUpperCase();

    /* =========================
       PREVENT DUPLICATES
    ========================= */
    const exists = await GestureMapping.findOne({
      controllerId,
      gesture: normalizedGesture,
      deviceId,
      appliance,
    });

    if (exists) {
      return res.status(409).json({
        message: "Mapping already exists for this gesture and appliance",
      });
    }

    /* =========================
       SAVE MAPPING
    ========================= */
    const mapping = await GestureMapping.create({
      controllerId,
      gesture: normalizedGesture,
      deviceId,
      appliance,
      action,
    });

    res.status(201).json({
      message: "Gesture mapping created",
      mapping,
    });
  } catch (err) {
    console.error("GESTURE MAPPING POST ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* =====================================================
   GET /api/gesture-mappings/:controllerId
   Fetch mappings for controller
===================================================== */
router.get("/:controllerId", async (req, res) => {
  try {
    const { controllerId } = req.params;

    const mappings = await GestureMapping.find({
      controllerId,
    }).sort({ createdAt: -1 });

    res.json(mappings);
  } catch (err) {
    console.error("GESTURE MAPPING GET ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* =====================================================
   DELETE /api/gesture-mappings/:id
   Delete a mapping
===================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await GestureMapping.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Mapping not found",
      });
    }

    res.json({
      message: "Mapping deleted successfully",
    });
  } catch (err) {
    console.error("GESTURE MAPPING DELETE ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

