import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* -----------------------------
   Controller ID generator
------------------------------*/
function generateControllerId() {
  return "RP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function AddController() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [controllerId, setControllerId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* -----------------------------
     Generate + save controller
  ------------------------------*/
  const handleGenerate = async () => {
    if (!name || !location) {
      alert("Please enter controller name and location");
      return;
    }

    setLoading(true);

    try {
      let created = false;

      while (!created) {
        const id = generateControllerId();

        try {
          await axios.post("http://localhost:5000/api/controllers", {
            controllerId: id,
            name,
            location,
          });

          setControllerId(id);
          created = true;
        } catch (err) {
          // Retry only if duplicate ID
          if (err.response?.status !== 409) {
            throw err;
          }
        }
      }
    } catch (error) {
      console.error("Failed to add controller:", error);
      alert("Failed to create controller. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Add Controller
        </Typography>

        {!controllerId ? (
          <Stack spacing={3}>
            <TextField
              label="Controller Name"
              placeholder="My Home"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Location"
              placeholder="Living Room"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Creating…" : "Generate Controller ID"}
            </Button>
          </Stack>
        ) : (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>
              Controller Created Successfully ✅
            </Typography>

            <Typography sx={{ mt: 2 }}>
              Controller ID
            </Typography>

            <Typography
              variant="h5"
              fontWeight={600}
              sx={{ fontFamily: "monospace" }}
            >
              {controllerId}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              Configure this ID in your Raspberry Pi wearable
            </Typography>

            <Button
              sx={{ mt: 3 }}
              variant="outlined"
              onClick={() => navigate("/controllers")}
            >
              Back to Controllers
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default AddController;
