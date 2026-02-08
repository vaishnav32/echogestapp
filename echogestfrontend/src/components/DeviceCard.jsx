import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import axios from "axios";

/* =========================================
   CONFIG
========================================= */

const API_BASE = "https://echogestapp.onrender.com";
const DEVICE_ID = "ESP-01"; // single ESP32 for demo

/* =========================================
   COMPONENT
========================================= */

function DeviceCard({ onNotify }) {
  const sendCommand = async (appliance, action) => {
    try {
      await axios.post(`${API_BASE}/api/devices/ack`, {
        deviceId: DEVICE_ID,
        appliance,
        status: action,
      });

      if (onNotify) {
        onNotify(`${appliance} ${action} command sent`);
      }
    } catch (error) {
      console.error("Command failed:", error);
      if (onNotify) {
        onNotify("Failed to send command");
      }
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Device Control (Manual)
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Manual override controls. Commands are sent to the backend and
          executed by ESP32 when available.
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* LIGHT */}
        <Typography variant="subtitle1" fontWeight={500}>
          Light
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<PowerSettingsNewIcon />}
            onClick={() => sendCommand("Light", "ON")}
          >
            ON
          </Button>
          <Button
            variant="outlined"
            onClick={() => sendCommand("Light", "OFF")}
          >
            OFF
          </Button>
        </Stack>

        {/* FAN */}
        <Typography variant="subtitle1" fontWeight={500}>
          Fan
        </Typography>
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<PowerSettingsNewIcon />}
            onClick={() => sendCommand("Fan", "ON")}
          >
            ON
          </Button>
          <Button
            variant="outlined"
            onClick={() => sendCommand("Fan", "OFF")}
          >
            OFF
          </Button>
        </Stack>

        {/* AC */}
        <Typography variant="subtitle1" fontWeight={500}>
          AC
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<PowerSettingsNewIcon />}
            onClick={() => sendCommand("AC", "ON")}
          >
            ON
          </Button>
          <Button
            variant="outlined"
            onClick={() => sendCommand("AC", "OFF")}
          >
            OFF
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default DeviceCard;


