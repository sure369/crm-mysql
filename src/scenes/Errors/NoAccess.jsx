import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../recordDetailPage/Form.css";

function NoAccess() {
  const navigate = useNavigate();

  const handleNavBack = (e) => {
    console.log("handle nav back", e);
    navigate(-1);
  };

  return (
    <>
    {/* <div style={{display:'flex', alignItems:'center',justifyContent:'center', height: '100vh', width: '100vw'}}>
  <img src="https://www.kindpng.com/picc/m/164-1647256_403-error-png-download-403-forbidden-png-transparent.png" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
</div> */}
        <div style={{display:'flex', alignItems:'center',justifyContent:'center'}}>

          <img
            height={430}
            src="https://www.kindpng.com/picc/m/164-1647256_403-error-png-download-403-forbidden-png-transparent.png"
          >

          </img>
        </div>
    </>
  );
}

export default NoAccess;
