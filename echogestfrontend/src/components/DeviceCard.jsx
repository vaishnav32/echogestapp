import {
  Card,
  CardContent,
  Typography,
  Switch,
  Grid,
  Stack,
} from "@mui/material";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import { useState } from "react";

const dummyDevices = [
  { id: 1, name: "Living Room Light", status: true },
  { id: 2, name: "Ceiling Fan", status: false },
  { id: 3, name: "TV Socket", status: false },
];

function DeviceCard({ onNotify }) {
  const [devices, setDevices] = useState(dummyDevices);

  const toggleDevice = (id) => {
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id === id) {
          const newStatus = !device.status;
          onNotify?.(
            `${device.name} turned ${newStatus ? "ON" : "OFF"}`
          );
          return { ...device, status: newStatus };
        }
        return device;
      })
    );
  };

  return (
    <Grid container spacing={3}>
      {devices.map((device) => (
        <Grid item xs={12} md={4} key={device.id}>
          <Card
            elevation={3}
            sx={{
              height: "100%",
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center">
                <ElectricalServicesIcon color="action" />
                <Typography variant="h6">
                  {device.name}
                </Typography>
              </Stack>

              <Switch
                checked={device.status}
                onChange={() => toggleDevice(device.id)}
                sx={{ mt: 1 }}
              />

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  fontWeight: 600,
                  color: device.status
                    ? "success.main"
                    : "error.main",
                }}
              >
                Status: {device.status ? "ON" : "OFF"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default DeviceCard;

