import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import './NoAccess.css'

function NoAccess() {
  const navigate = useNavigate();

  const handleNavBack = (e) => {
    console.log("handle nav back", e);
    navigate(-1);
  };

  return (
    <>
    
<div className="no-access">
      <h2>You have no access</h2>
      <img src="https://www.kindpng.com/picc/m/164-1647256_403-error-png-download-403-forbidden-png-transparent.png"
       alt="No access" />
    </div>

        {/* <div style={{display:'flex', alignItems:'center',justifyContent:'center'}}>
          <img
            height={430}
            src="https://www.kindpng.com/picc/m/164-1647256_403-error-png-download-403-forbidden-png-transparent.png"
          >
          </img>
        </div> */}
    </>
  );
}

export default NoAccess;
