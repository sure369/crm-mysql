import React from "react";
import { Box, Typography } from "@mui/material";

const ApiError = ({ error }) => {
  return (
    <Box
      sx={{
        backgroundColor: "#f8d7da",
        color: "#721c24",
        padding: "20px",
        borderRadius: "4px",
        textAlign: "center",
        maxWidth: "500px",
        margin: "auto",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {error.status}: {error.message}
      </Typography>
      <Typography variant="body1">
        Please try again later.
      </Typography>
    </Box>
  );
};

export default ApiError;