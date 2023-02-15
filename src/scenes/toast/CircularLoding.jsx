import React, { useEffect } from 'react'
import {Box,Stack,CircularProgress} from '@mui/material';

function CircularLoading() {
  useEffect(()=>{
    console.log('circular')
  })
  return (
    <Stack spacing={20}>
      <CircularProgress/>
    </Stack>
  //   <Box sx={{ display: 'flex' }}>
  //   <CircularProgress />
  // </Box>
 
  )

}

export default CircularLoading