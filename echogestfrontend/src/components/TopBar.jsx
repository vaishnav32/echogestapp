import { AppBar, Toolbar, Typography } from "@mui/material";

function TopBar() {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, letterSpacing: 0.3 }}
        >
          EchoGest • Smart Home
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;


