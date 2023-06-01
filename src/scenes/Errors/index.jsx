import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const ErrorComponent = ({ error, retry }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="300px"
    >
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Oops! Something went wrong.
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        {error}
      </Typography>
      <Button variant="contained" color="primary" onClick={retry}>
        Retry
      </Button>
    </Box>
  );
};

export default ErrorComponent;
