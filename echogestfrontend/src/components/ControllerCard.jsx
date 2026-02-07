import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function ControllerCard({
  controllerId,
  name,
  location,
  status,
  battery,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(
        `http://localhost:5000/api/controllers/${controllerId}`
      );
      window.location.reload(); // simple refresh
    } catch (err) {
      alert("Failed to delete controller");
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Card
        elevation={3}
        sx={{
          transition: "0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: 6,
          },
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} alignItems="center">
              <HomeIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                {name}
              </Typography>

              <Chip
                label={status === "online" ? "Online" : "Offline"}
                color={status === "online" ? "success" : "default"}
                size="small"
              />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Location: {location}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Controller ID: {controllerId}
            </Typography>

            {battery !== undefined && (
              <Typography variant="caption" color="text.secondary">
                Battery: {battery}%
              </Typography>
            )}

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() =>
                  navigate(`/dashboard/${controllerId}`)
                }
              >
                Open Dashboard
              </Button>

              <Button
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => setOpen(true)}
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Delete Controller?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete controller{" "}
            <strong>{controllerId}</strong>?  
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ControllerCard;





