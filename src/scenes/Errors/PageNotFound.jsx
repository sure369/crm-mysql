import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../recordDetailPage/Form.css";

function PageNotFound() {
  const navigate = useNavigate();

  const handleNavBack = (e) => {
    console.log("handle nav back", e);
    navigate(-1);
  };

  return (
    <>
      <Box sx={{ height: "600px", padding: "19px", bgcolor: "#cfe2f3" }}>
        <div className="errorPage">
          <div>
            <Typography
              className="textShadow"
              color="cornflowerblue"
              variant="h1"
              fontWeight="bold"
              fontSize="50px"
            >
              Page Not Found
            </Typography>
            <br />
          </div>
          {/* <div>
            <Typography
              className="textShadow"
              color="cornflowerblue"
              variant="h1"
              fontWeight="bold"
              fontSize="40px"
            >
              404 Error
            </Typography>
          </div> */}

          <img
            height={430}
            src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=740&t=st=1682506788~exp=1682507388~hmac=04680c6e3337a8511f578c69c3c3b49d453906c54e8882345f9b25769c688aed"
          ></img>
          <br />
          <div>
            <Button
              className="btnShadow"
              onClick={handleNavBack}
              size="large"
              variant="text"
            >
              <strong>Click Here to Go Back</strong>
            </Button>
          </div>
        </div>
      </Box>
    </>
  );
}

export default PageNotFound;
