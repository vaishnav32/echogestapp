import { Snackbar, Alert } from "@mui/material";
import { useEffect, useState } from "react";

function Notifications({ message }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity="info" onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default Notifications;