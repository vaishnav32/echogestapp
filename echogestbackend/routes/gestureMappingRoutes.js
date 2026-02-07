import express from "express";
import GestureMapping from "../models/GestureMapping.js";

const router = express.Router();

/* ---------------- Add Mapping ---------------- */
router.post("/", async (req, res) => {
  try {
    const {
      controllerId,
      gesture,
      deviceId,
      appliance,
      action,
    } = req.body;

    if (!controllerId || !gesture || !deviceId || !appliance || !action) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const mapping = new GestureMapping({
      controllerId,
      gesture,
      deviceId,
      appliance,
      action,
    });

    await mapping.save();

    res.status(201).json(mapping);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- Get Mappings for Controller ---------------- */
router.get("/:controllerId", async (req, res) => {
  try {
    const mappings = await GestureMapping.find({
      controllerId: req.params.controllerId,
    });

    res.json(mappings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ---------------- Delete Mapping ---------------- */
router.delete("/:id", async (req, res) => {
  try {
    await GestureMapping.findByIdAndDelete(req.params.id);
    res.json({ message: "Mapping deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
