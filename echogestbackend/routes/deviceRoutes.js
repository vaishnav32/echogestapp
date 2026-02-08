import express from "express";
import DeviceCommand from "../models/DeviceCommand.js";

const router = express.Router();

/* =========================================
   GET /api/devices/commands/:deviceId
   ESP32 polling endpoint
========================================= */
router.get("/commands/:deviceId", async (req, res) => {
  const { deviceId } = req.params;

  // Get oldest command and DELETE it (one-time execution)
  const command = await DeviceCommand.findOneAndDelete(
    { deviceId },
    { sort: { createdAt: 1 } }
  );

  res.status(200).json({
    command: command
      ? {
          appliance: command.appliance,
          action: command.action,
        }
      : null,
  });
});

/* =========================================
   POST /api/devices/ack
   ESP32 acknowledgment (optional)
========================================= */
router.post("/ack", (req, res) => {
  const { deviceId, appliance, status } = req.body;

  console.log(
    `ESP32 ${deviceId} executed ${appliance} -> ${status}`
  );

  res.json({ message: "ACK received" });
});

export default router;


