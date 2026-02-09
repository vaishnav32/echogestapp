import express from "express";
import mongoose from "mongoose";
import cors from "cors";

/* =========================
   ROUTES
========================= */
import controllerRoutes from "./routes/controllerRoutes.js";
import gestureRoutes from "./routes/gestureRoutes.js";
import gestureMappingRoutes from "./routes/gestureMappingRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";

/* =========================
   APP SETUP
========================= */
const app = express();

/* Middleware */
app.use(cors());
app.use(express.json()); // VERY IMPORTANT for Raspberry Pi + Postman

/* =========================
   ROUTE MOUNTING
========================= */
app.use("/api/controllers", controllerRoutes);
app.use("/api/gestures", gestureRoutes);
app.use("/api/gesture-mappings", gestureMappingRoutes);
app.use("/api/devices", deviceRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("EchoGest Backend is running 🚀");
});

/* =========================
   DATABASE CONNECTION
========================= */
const MONGO_URI =
  "mongodb+srv://echogest:echogestPI5@cluster0.sjdebtx.mongodb.net/echogest?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});








