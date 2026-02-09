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
  Typography,
} from "@mui/material";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import EmptyState from "./EmptyState";

/* ============================
   CONFIG
============================ */
const API_BASE = "https://echogestapp.onrender.com";
const INITIAL_LIMIT = 5;

/* ============================
   COMPONENT
============================ */
function AudioTable() {
  const { controllerId } = useParams();

  const [audioEvents, setAudioEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ============================
     FETCH AUDIO LOGS
  ============================ */
  const fetchAudio = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_BASE}/api/audio/${controllerId}`,
        {
          params: {
            from: fromDate || undefined,
            to: toDate || undefined,
          },
        }
      );

      setAudioEvents(res.data);
    } catch (error) {
      console.error("Error fetching audio logs:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ============================
     INITIAL LOAD
  ============================ */
  useEffect(() => {
    fetchAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controllerId]);

  /* ============================
     LOADING STATE
  ============================ */
  if (loading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Loading audio logs…</Typography>
      </Paper>
    );
  }

  /* ============================
     EMPTY STATE
  ============================ */
  if (audioEvents.length === 0) {
    return (
      <>
        <FilterBar
          fromDate={fromDate}
          toDate={toDate}
          setFromDate={setFromDate}
          setToDate={setToDate}
          onApply={fetchAudio}
        />

        <EmptyState
          icon={<GraphicEqIcon sx={{ fontSize: 40 }} />}
          title="No audio logs"
          subtitle="No audio events found for the selected time range"
        />
      </>
    );
  }

  /* ============================
     LIMIT LOGIC
  ============================ */
  const visibleAudio = showAll
    ? audioEvents
    : audioEvents.slice(0, INITIAL_LIMIT);

  /* ============================
     RENDER TABLE
  ============================ */
  return (
    <>
      {/* Filter bar */}
      <FilterBar
        fromDate={fromDate}
        toDate={toDate}
        setFromDate={setFromDate}
        setToDate={setToDate}
        onApply={fetchAudio}
      />

      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Sound</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Confidence</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Time</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleAudio.map((a) => (
              <TableRow key={a._id} hover>
                <TableCell>{a.sound}</TableCell>
                <TableCell align="center">
                  {a.confidence !== null
                    ? `${(a.confidence * 100).toFixed(0)}%`
                    : "—"}
                </TableCell>
                <TableCell align="right">
                  {new Date(a.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Show more / less */}
      {audioEvents.length > INITIAL_LIMIT && (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button size="small" onClick={() => setShowAll(!showAll)}>
            {showAll ? "Show less" : "Show more"}
          </Button>
        </Box>
      )}
    </>
  );
}

/* ============================
   FILTER BAR
============================ */
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

export default AudioTable;




