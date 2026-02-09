import express from "express";
import DeviceCommand from "../models/DeviceCommand.js";

const router = express.Router();

/* =====================================================
   POST /api/devices/manual
   Manual override from dashboard UI
===================================================== */
router.post("/manual", async (req, res) => {
  try {
    const { controllerId, deviceId, appliance, action } = req.body;

    if (!controllerId || !deviceId || !appliance || !action) {
      return res.status(400).json({
        message: "controllerId, deviceId, appliance and action are required",
      });
    }

    const command = await DeviceCommand.create({
      controllerId,
      deviceId,
      appliance,
      action,
      executed: false,
    });

    res.status(201).json({
      message: "Manual command queued",
      commandId: command._id,
    });
  } catch (error) {
    console.error("Manual command error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/* =====================================================
   GET /api/devices/commands/:deviceId
   ESP32 polling
===================================================== */
router.get("/commands/:deviceId", async (req, res) => {
  const { deviceId } = req.params;

  if (!deviceId) {
    return res.status(400).json({ message: "deviceId required" });
  }

  const command = await DeviceCommand.findOne({
    deviceId,
    executed: false,
  }).sort({ createdAt: 1 });

  if (!command) {
    return res.json({ command: null });
  }

  res.json({
    commandId: command._id,
    appliance: command.appliance,
    action: command.action,
  });
});

/* =====================================================
   POST /api/devices/ack
   ESP32 acknowledges execution
===================================================== */
router.post("/ack", async (req, res) => {
  const { commandId } = req.body;

  if (!commandId) {
    return res.status(400).json({ message: "commandId required" });
  }

  await DeviceCommand.findByIdAndUpdate(commandId, {
    executed: true,
    executedAt: new Date(),
  });

  res.json({ message: "Command acknowledged" });
});

export default router;






