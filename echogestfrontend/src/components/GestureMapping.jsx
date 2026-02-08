import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GESTURES = ["FIST", "OPEN_HAND", "SWIPE_LEFT", "SWIPE_RIGHT"];
const APPLIANCES = ["Light", "Fan", "AC"];
const DEVICE_ID = "ESP-01"; // placeholder

function GestureMapping() {
  const { controllerId } = useParams();
  const [mappings, setMappings] = useState([]);
  const [open, setOpen] = useState(false);

  const [gesture, setGesture] = useState("");
  const [appliance, setAppliance] = useState("");
  const [action, setAction] = useState("");

  const fetchMappings = async () => {
    const res = await axios.get(
      `https://echogestapp.onrender.com/api/gesture-mappings/${controllerId}`
    );
    setMappings(res.data);
  };

  useEffect(() => {
    fetchMappings();
  }, [controllerId]);

  const addMapping = async () => {
    await axios.post(
      "https://echogestapp.onrender.com/api/gesture-mappings",
      {
        controllerId,
        gesture,
        deviceId: DEVICE_ID,
        appliance,
        action,
      }
    );

    setOpen(false);
    setGesture("");
    setAppliance("");
    setAction("");
    fetchMappings();
  };

  const deleteMapping = async (id) => {
    await axios.delete(
      `https://echogestapp.onrender.com/api/gesture-mappings/${id}`
    );
    fetchMappings();
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">
          Gesture Automation Rules
        </Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Mapping
        </Button>
      </Stack>

      {mappings.length === 0 ? (
        <Typography color="text.secondary">
          No mappings configured yet.
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Gesture</TableCell>
              <TableCell>Appliance</TableCell>
              <TableCell>Action</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mappings.map((m) => (
              <TableRow key={m._id}>
                <TableCell>{m.gesture}</TableCell>
                <TableCell>{m.appliance}</TableCell>
                <TableCell>{m.action}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => deleteMapping(m._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Gesture Mapping</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Select
              value={gesture}
              onChange={(e) => setGesture(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Gesture</MenuItem>
              {GESTURES.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={appliance}
              onChange={(e) => setAppliance(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Appliance</MenuItem>
              {APPLIANCES.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Select Action</MenuItem>
              <MenuItem value="ON">ON</MenuItem>
              <MenuItem value="OFF">OFF</MenuItem>
            </Select>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={addMapping}
            disabled={!gesture || !appliance || !action}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default GestureMapping;

