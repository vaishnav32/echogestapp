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
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import EmptyState from "./EmptyState";

const INITIAL_LIMIT = 5;

function AudioTable() {
  const { controllerId } = useParams();

  const [audioEvents, setAudioEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Date filter state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchAudio = async () => {
    try {
      setLoading(true);

      let url = `https://echogestapp.onrender.com/api/audio/${controllerId}`;

      const params = [];
      if (fromDate) params.push(`from=${fromDate}`);
      if (toDate) params.push(`to=${toDate}`);

      if (params.length > 0) {
        url += "?" + params.join("&");
      }

      const res = await axios.get(url);
      setAudioEvents(res.data);
    } catch (error) {
      console.error("Error fetching audio logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudio();
  }, [controllerId]);

  if (loading) {
    return <Paper sx={{ p: 3 }}>Loading audio logs…</Paper>;
  }

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
          subtitle="No data found for the selected time range"
        />
      </>
    );
  }

  const visibleAudio = showAll
    ? audioEvents
    : audioEvents.slice(0, INITIAL_LIMIT);

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
              <TableCell><strong>Sound</strong></TableCell>
              <TableCell align="center"><strong>Confidence</strong></TableCell>
              <TableCell align="right"><strong>Time</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleAudio.map((a) => (
              <TableRow key={a._id} hover>
                <TableCell>{a.sound}</TableCell>
                <TableCell align="center">
                  {(a.confidence * 100).toFixed(0)}%
                </TableCell>
                <TableCell align="right">
                  {new Date(a.timestamp).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

/* ---------------- Filter Bar Component ---------------- */

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



