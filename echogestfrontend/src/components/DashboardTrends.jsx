import {
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function TrendCard({ title, data, dataKey, color }) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {title}
        </Typography>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function DashboardTrends({ gestureData, audioData }) {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6}>
        <TrendCard
          title="Gesture Activity (Today)"
          data={gestureData}
          dataKey="count"
          color="#1976d2"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TrendCard
          title="Audio Activity (Today)"
          data={audioData}
          dataKey="count"
          color="#9c27b0"
        />
      </Grid>
    </Grid>
  );
}

export default DashboardTrends;
