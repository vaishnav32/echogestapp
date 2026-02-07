import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import PowerIcon from "@mui/icons-material/Power";
import BoltIcon from "@mui/icons-material/Bolt";
import PanToolIcon from "@mui/icons-material/PanTool";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";

function SummaryCard({ icon, title, value, chipColor }) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            {icon}
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Stack>

          <Typography variant="h5" fontWeight={600}>
            {value}
          </Typography>

          {chipColor && (
            <Chip
              label={value}
              size="small"
              color={chipColor}
              sx={{ width: "fit-content" }}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function DashboardSummary({
  status,
  battery,
  gestureCount,
  audioCount,
}) {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          icon={<PowerIcon color="success" />}
          title="Controller Status"
          value={status === "online" ? "Online" : "Offline"}
          chipColor={status === "online" ? "success" : "default"}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          icon={<BoltIcon color="warning" />}
          title="Battery Level"
          value={battery !== null ? `${battery}%` : "—"}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          icon={<PanToolIcon color="primary" />}
          title="Gestures Today"
          value={gestureCount}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <SummaryCard
          icon={<GraphicEqIcon color="secondary" />}
          title="Audio Events Today"
          value={audioCount}
        />
      </Grid>
    </Grid>
  );
}

export default DashboardSummary;
