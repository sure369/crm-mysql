import React, { useEffect, useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Box, Grid, Button, DialogActions } from "@mui/material";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LeadDetailPage from "../recordDetailPage/LeadDetailPage";
import LeadRelatedItems from "../leads/RelatedItems";

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

Item.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

const FlexLeads = (item) => {

  const [passedRecord, setPassedRecord] = useState();
  const location = useLocation();
  const params = useParams()

  useEffect(() => {

    console.log('passed record', location.state.record.item)
    console.log('params', params)
    setPassedRecord(location.state.record.item);
  }, [])



  return (
    <div style={{ width: '100%' }}>
      <Box
        sx={{ display: 'flex', p: 1, bgcolor: 'background.paper', borderRadius: 1 }}
      >
        <Grid container>
          <Grid item xs={12} md={8} >
            <Item > <LeadDetailPage props={passedRecord} /> </Item>
          </Grid>
          <Grid item xs={12} md={4}>
            <Item > <LeadRelatedItems props={passedRecord} /> </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
export default FlexLeads
