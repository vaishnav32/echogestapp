import {
  Container,
  Typography,
  Divider,
  Chip,
  Stack,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

/* Icons */
import PowerIcon from "@mui/icons-material/Power";
import BatteryFullIcon from "@mui/icons-material/BatteryFull";
import PanToolIcon from "@mui/icons-material/PanTool";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";

/* Components */
import TopBar from "../components/TopBar";
import GestureTable from "../components/GestureTable";
import AudioTable from "../components/AudioTable";
import DeviceCard from "../components/DeviceCard";
import Notifications from "../components/Notifications";
import DashboardTrends from "../components/DashboardTrends";
import GestureMapping from "../components/GestureMapping";

/* ---------------- Utilities ---------------- */

function formatLastSeen(date) {
  if (!date) return "Never";
  const diff = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  if (diff < 10) return "Just now";
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

function groupByHour(events, key = "timestamp") {
  const map = {};
  events.forEach((e) => {
    const h = new Date(e[key]).getHours();
    map[h] = (map[h] || 0) + 1;
  });

  return Object.keys(map)
    .sort((a, b) => a - b)
    .map((h) => ({
      time: `${h}:00`,
      count: map[h],
    }));
}

/* ---------------- Dashboard ---------------- */

function Dashboard() {
  const { controllerId } = useParams();

  const [controller, setController] = useState(null);
  const [gestureCount, setGestureCount] = useState(0);
  const [audioCount, setAudioCount] = useState(0);
  const [gestureTrend, setGestureTrend] = useState([]);
  const [audioTrend, setAudioTrend] = useState([]);
  const [notifyMsg, setNotifyMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ctrlRes = await axios.get(
          "http://localhost:5000/api/controllers"
        );

        const found = ctrlRes.data.find(
          (c) => c.controllerId === controllerId
        );
        setController(found || null);

        const today = new Date().toISOString().split("T")[0];

        const [gestureRes, audioRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/gestures/${controllerId}?from=${today}`
          ),
          axios.get(
            `http://localhost:5000/api/audio/${controllerId}?from=${today}`
          ),
        ]);

        setGestureCount(gestureRes.data.length);
        setAudioCount(audioRes.data.length);
        setGestureTrend(groupByHour(gestureRes.data));
        setAudioTrend(groupByHour(audioRes.data));
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [controllerId]);

  return (
    <>
      <TopBar />

      <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Controller Dashboard
        </Typography>

        {/* ================= Summary Cards ================= */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {/* Controller Status */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PowerIcon color="primary" sx={{ fontSize: 40 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Controller
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {controllerId}
                    </Typography>
                    <Chip
                      size="small"
                      label={
                        controller?.status === "online"
                          ? "Online"
                          : "Offline"
                      }
                      color={
                        controller?.status === "online"
                          ? "success"
                          : "default"
                      }
                      sx={{ mt: 1 }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Last seen:{" "}
                      {formatLastSeen(controller?.lastSeen)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Battery */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <BatteryFullIcon
                    color="primary"
                    sx={{ fontSize: 40 }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Battery Level
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {controller?.battery ?? "—"}%
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Gestures */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PanToolIcon
                    color="primary"
                    sx={{ fontSize: 40 }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Gestures Today
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {gestureCount}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Audio */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <GraphicEqIcon
                    color="primary"
                    sx={{ fontSize: 40 }}
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Audio Events Today
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {audioCount}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* ================= Charts ================= */}
        <Box sx={{ mb: 6 }}>
          <DashboardTrends
            gestureData={gestureTrend}
            audioData={audioTrend}
          />
        </Box>

        <Divider sx={{ my: 5 }} />

        <Typography variant="h6" gutterBottom>
          Gesture Logs
        </Typography>
        <GestureTable />

        <Divider sx={{ my: 5 }} />

        <Typography variant="h6" gutterBottom>
          Audio Logs
        </Typography>
        <AudioTable />

        <Divider sx={{ my: 5 }} />

        <Typography variant="h6" gutterBottom>
          Gesture Automation Rules
        </Typography>
        <GestureMapping />

        <Divider sx={{ my: 5 }} />

        <Typography variant="h6" gutterBottom>
          Device Controls
        </Typography>
        <DeviceCard onNotify={setNotifyMsg} />
      </Container>

      <Notifications message={notifyMsg} />
    </>
  );
}

export default Dashboard;






