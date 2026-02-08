import express from "express";
import { getCommand } from "../commandQueue.js";

const router = express.Router();

/* =====================================================
   ESP32 polls for command
   GET /api/devices/commands/:deviceId
===================================================== */
router.get("/commands/:deviceId", (req, res) => {
  const { deviceId } = req.params;
  const command = getCommand(deviceId);
  res.json({ command });
});

/* =====================================================
   ESP32 sends ACK
   POST /api/devices/ack
===================================================== */
router.post("/ack", (req, res) => {
  const { deviceId, appliance, status } = req.body;
  console.log(`ESP32 ${deviceId} executed ${appliance} → ${status}`);
  res.json({ message: "ACK received" });
});

export default router;
