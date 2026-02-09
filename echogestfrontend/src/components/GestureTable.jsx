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
} from "@mui/material";
import PanToolIcon from "@mui/icons-material/PanTool";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import EmptyState from "./EmptyState";

const INITIAL_LIMIT = 5;
const API_BASE = "https://echogestapp.onrender.com";

function GestureTable() {
  const { controllerId } = useParams();

  const [gestures, setGestures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchGestures = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/api/gestures/${controllerId}`,
        {
          params: {
            from: fromDate || undefined,
            to: toDate || undefined,
          },
        }
      );

      setGestures(res.data);
    } catch (err) {
      console.error("Gesture fetch failed:", err);
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
              <TableCell align="center"><strong>Confidence</strong></TableCell>
              <TableCell align="right"><strong>Time</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleGestures.map((g) => (
              <TableRow key={g._id} hover>
                <TableCell>{g.gesture}</TableCell>
                <TableCell align="center">
                  {g.confidence !== null
                    ? `${(g.confidence * 100).toFixed(0)}%`
                    : "—"}
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







