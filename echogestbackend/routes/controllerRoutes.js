import express from "express";
import Controller from "../models/Controller.js";
import {
  updateHeartbeat,
  getControllers as getHeartbeatControllers,
  removeHeartbeat,
} from "../controllersHeartbeat.js";

const router = express.Router();

/* =========================================================
   POST /api/controllers
   Add Controller (from frontend)
========================================================= */
router.post("/", async (req, res) => {
  try {
    const { controllerId, name, location } = req.body;

    if (!controllerId || !name || !location) {
      return res.status(400).json({
        message: "controllerId, name and location are required",
      });
    }

    const exists = await Controller.findOne({ controllerId });
    if (exists) {
      return res.status(409).json({
        message: "Controller already exists",
      });
    }

    const controller = new Controller({
      controllerId,
      name,
      location,
    });

    await controller.save();

    res.status(201).json({
      message: "Controller added successfully",
      controller,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Controller ID already exists",
      });
    }
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   GET /api/controllers
   Merge DB controllers + heartbeat status
========================================================= */
router.get("/", async (req, res) => {
  try {
    const dbControllers = await Controller.find();
    const heartbeatControllers = getHeartbeatControllers();

    const merged = dbControllers.map((ctrl) => {
      const live = heartbeatControllers.find(
        (h) => h.controllerId === ctrl.controllerId
      );

      return {
        controllerId: ctrl.controllerId,
        name: ctrl.name,
        location: ctrl.location,
        status: live ? live.status : "offline",
        battery: live ? live.battery : null,
        lastSeen: live ? live.lastSeen : null,
      };
    });

    res.json(merged);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================================================
   POST /api/controllers/heartbeat
   Called by Raspberry Pi wearable
========================================================= */
router.post("/heartbeat", (req, res) => {
  const { controllerId, battery } = req.body;

  if (!controllerId) {
    return res.status(400).json({
      message: "controllerId is required",
    });
  }

  updateHeartbeat(controllerId, battery);

  res.json({ message: "Heartbeat received" });
});

/* =========================================================
   DELETE /api/controllers/:controllerId
   Delete controller (safe)
========================================================= */
router.delete("/:controllerId", async (req, res) => {
  try {
    const { controllerId } = req.params;

    const deleted = await Controller.findOneAndDelete({
      controllerId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "Controller not found",
      });
    }

    // Remove live heartbeat if present
    removeHeartbeat(controllerId);

    res.json({
      message: "Controller deleted successfully",
      controllerId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


