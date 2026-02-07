import {
  Container,
  Typography,
  Grid,
  Button,
  Divider,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import ControllerCard from "../components/ControllerCard";
import TopBar from "../components/TopBar";

function Controllers() {
  const [controllers, setControllers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchControllers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/controllers"
        );

        // Map backend data → UI-friendly shape
        const formatted = res.data.map((ctrl) => ({
          controllerId: ctrl.controllerId,
          name: "My Home",          // placeholder (can be customized later)
          location: "Living Room",  // placeholder
          status: ctrl.status,
          battery: ctrl.battery,
        }));

        setControllers(formatted);
      } catch (err) {
        console.error("Failed to fetch controllers", err);
        setControllers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchControllers();

    // auto-refresh every 10 seconds
    const interval = setInterval(fetchControllers, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <TopBar />

      <Container maxWidth="lg" sx={{ mt: 4, mb: 5 }}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h4" fontWeight={600}>
            Controllers
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/add-controller")}
          >
            Add Controller
          </Button>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {loading ? (
          <Typography color="text.secondary">
            Loading controllers…
          </Typography>
        ) : controllers.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h5">
              No controllers added yet
            </Typography>
            <Typography color="text.secondary">
              Add a controller to start controlling your home devices.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {controllers.map((ctrl) => (
              <Grid item xs={12} md={6} key={ctrl.controllerId}>
                <ControllerCard {...ctrl} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default Controllers;





