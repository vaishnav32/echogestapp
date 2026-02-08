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

  const fetchControllers = async () => {
    try {
      const res = await axios.get("https://echogestapp.onrender.com/api/controllers");
      setControllers(res.data);
    } catch (err) {
      console.error("Failed to fetch controllers", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchControllers();
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






