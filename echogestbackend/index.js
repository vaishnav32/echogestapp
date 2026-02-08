import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import controllerRoutes from "./routes/controllerRoutes.js";
import gestureRoutes from "./routes/gestureRoutes.js";
import audioRoutes from "./routes/audioRoutes.js";
import gestureMappingRoutes from "./routes/gestureMappingRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";

/* ======================================================
   App Init
====================================================== */

const app = express();

/* ======================================================
   Middleware
====================================================== */

app.use(cors());
app.use(express.json());

/* ======================================================
   MongoDB Connection
====================================================== */

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://echogest:echogestPI5@cluster0.sjdebtx.mongodb.net/echogest";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

/* ======================================================
   Routes
====================================================== */

app.get("/", (req, res) => {
  res.send("EchoGest backend running");
});

// Controllers + heartbeat
app.use("/api/controllers", controllerRoutes);

// Gesture logs + trigger logic
app.use("/api/gestures", gestureRoutes);

// Audio logs
app.use("/api/audio", audioRoutes);

// Gesture → appliance mappings
app.use("/api/gesture-mappings", gestureMappingRoutes);

// ESP32 command polling + ACK
app.use("/api/devices", deviceRoutes);

/* ======================================================
   Server Start
====================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});






