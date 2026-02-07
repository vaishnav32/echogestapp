import express from "express";
import mongoose from "mongoose";
import cors from "cors";

/* -------- Route imports -------- */
import controllerRoutes from "./routes/controllerRoutes.js";
import gestureRoutes from "./routes/gestureRoutes.js";
import audioRoutes from "./routes/audioRoutes.js";
import gestureMappingRoutes from "./routes/gestureMappingRoutes.js";

/* -------- App setup -------- */
const app = express();
const PORT = 5000;

/* -------- Middleware -------- */
app.use(cors());
app.use(express.json());

/* -------- MongoDB connection -------- */
mongoose
  .connect(
    "mongodb+srv://echogest:echogestPI5@cluster0.sjdebtx.mongodb.net/echogest?appName=Cluster0"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* -------- Routes -------- */
/*
  NOTE:
  - Heartbeat is handled INSIDE controllerRoutes
  - index.js does NOT know about controllersHeartbeat.js
*/
app.use("/api/controllers", controllerRoutes);
app.use("/api/gestures", gestureRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/gesture-mappings", gestureMappingRoutes);

/* -------- Health check -------- */
app.get("/", (req, res) => {
  res.send("EchoGest Backend Running 🚀");
});

/* -------- Start server -------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});





