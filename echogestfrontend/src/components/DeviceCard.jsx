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
const DEVICE_ID = "ESP-01";
const CONTROLLER_ID = "RP-AX92"; // later derive from route

/* =========================================
   COMPONENT
========================================= */

function DeviceCard({ onNotify }) {
  const sendCommand = async (appliance, action) => {
    try {
      await axios.post(`${API_BASE}/api/devices/manual`, {
        controllerId: CONTROLLER_ID,
        deviceId: DEVICE_ID,
        appliance,
        action,
      });

      if (onNotify) {
        onNotify(`${appliance} ${action} command queued`);
      }
    } catch (error) {
      console.error("Manual command failed:", error);
      if (onNotify) {
        onNotify("Failed to send manual command");
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
          Manual override controls. Commands are queued and executed by ESP32.
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



