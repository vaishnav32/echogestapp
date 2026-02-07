import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  TextField,
  Stack,
  LinearProgress,
  Typography,
} from "@mui/material";
import PanToolIcon from "@mui/icons-material/PanTool";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import EmptyState from "./EmptyState";

const INITIAL_LIMIT = 5;

/* ---------------- Gesture icon mapping ---------------- */
const gestureIcon = {
  LIGHT_ON: "💡",
  LIGHT_OFF: "💡",
  FAN_ON: "🌀",
  FAN_OFF: "🌀",
};

function GestureTable() {
  const { controllerId } = useParams();

  const [gestures, setGestures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Date filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchGestures = async () => {
    try {
      setLoading(true);

      let url = `http://localhost:5000/api/gestures/${controllerId}`;

      const params = [];
      if (fromDate) params.push(`from=${fromDate}`);
      if (toDate) params.push(`to=${toDate}`);
      if (params.length) url += "?" + params.join("&");

      const res = await axios.get(url);

      // latest first
      const sorted = res.data.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      setGestures(sorted);
    } catch (err) {
      console.error("Error fetching gestures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGestures();
  }, [controllerId]);

  if (loading) {
    return <Paper sx={{ p: 3 }}>Loading gesture logs…</Paper>;
  }

  if (gestures.length === 0) {
    return (
      <>
        <FilterBar
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          onApply={fetchGestures}
        />

        <EmptyState
          icon={<PanToolIcon sx={{ fontSize: 40 }} />}
          title="No gesture logs"
          subtitle="No gestures detected for the selected time range"
        />
      </>
    );
  }

  const visibleGestures = showAll
    ? gestures
    : gestures.slice(0, INITIAL_LIMIT);

  return (
    <>
      {/* Filter bar */}
      <FilterBar
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        onApply={fetchGestures}
      />

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Gesture</strong></TableCell>
              <TableCell><strong>Confidence</strong></TableCell>
              <TableCell align="right"><strong>Time</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleGestures.map((g) => (
              <TableRow key={g._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>
                      {gestureIcon[g.gesture] || "✋"}
                    </Typography>
                    <Typography>{g.gesture}</Typography>
                  </Stack>
                </TableCell>

                <TableCell sx={{ minWidth: 160 }}>
                  <Typography variant="body2">
                    {(g.confidence * 100).toFixed(0)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={g.confidence * 100}
                    sx={{ height: 6, borderRadius: 4, mt: 0.5 }}
                  />
                </TableCell>

                <TableCell align="right">
                  {new Date(g.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {gestures.length > INITIAL_LIMIT && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button size="small" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show less" : "Show more"}
          </Button>
        </Box>
      )}
    </>
  );
}

/* ---------------- Filter Bar ---------------- */

function FilterBar({
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  onApply,
}) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ mb: 2 }}
    >
      <TextField
        label="From"
        type="datetime-local"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        size="small"
      />

      <TextField
        label="To"
        type="datetime-local"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        size="small"
      />

      <Button variant="outlined" onClick={onApply}>
        Apply
      </Button>
    </Stack>
  );
}

export default GestureTable;





