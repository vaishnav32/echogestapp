import { Box, Typography } from "@mui/material";

function EmptyState({ icon, title, subtitle }) {
  return (
    <Box
      sx={{
        py: 6,
        textAlign: "center",
        color: "text.secondary",
      }}
    >
      {icon}
      <Typography variant="h6" sx={{ mt: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2">
        {subtitle}
      </Typography>
    </Box>
  );
}

export default EmptyState;
