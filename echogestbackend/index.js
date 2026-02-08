import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Routes
import gestureRoutes from "./routes/gestureRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import controllerRoutes from "./routes/controllerRoutes.js";
import gestureMappingRoutes from "./routes/gestureMappingRoutes.js";
import audioRoutes from "./routes/audioRoutes.js";

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
mongoose
  .connect(
    "mongodb+srv://echogest:echogestPI5@cluster0.sjdebtx.mongodb.net/echogest?appName=Cluster0"
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err)
  );

/* ================= ROUTES ================= */
app.use("/api/gestures", gestureRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/controllers", controllerRoutes);
app.use("/api/gesture-mappings", gestureMappingRoutes);
app.use("/api/audio", audioRoutes);

/* ================= HEALTH ================= */
app.get("/", (req, res) => {
  res.send("EchoGest Backend is running 🚀");
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});







