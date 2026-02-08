import express from "express";
import { getCommand } from "../commandQueue.js";

const router = express.Router();

/* =========================================
   ESP32 polls for commands
========================================= */
router.get("/commands/:deviceId", (req, res) => {
  const { deviceId } = req.params;

  if (!deviceId) {
    return res.status(400).json({
      message: "deviceId is required",
    });
  }

  const command = getCommand(deviceId);

  // ✅ ALWAYS return 200
  res.status(200).json({
    command: command || null,
  });
});

/* =========================================
   ESP32 ACK
========================================= */
router.post("/ack", (req, res) => {
  const { deviceId, appliance, status } = req.body;

  if (!deviceId) {
    return res.status(400).json({
      message: "deviceId is required",
    });
  }

  console.log(
    `ESP32 ${deviceId} executed ${appliance} -> ${status}`
  );

  res.json({ message: "ACK received" });
});

export default router;

