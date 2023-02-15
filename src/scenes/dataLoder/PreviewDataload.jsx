import React from 'react'
import axios from 'axios';
import {
    Paper,Table,TableBody,TableCell,TableHead,TableRow,Typography,DialogActions,Button
} from "@mui/material";

const UpsertOppUrl=`${process.env.REACT_APP_SERVER_URL}/dataloaderOpportunity`;

function PreviewDataload({  data ,file }) {

    const headers = Object.keys(data[0]);

    console.log('file',file)
    const handleModal=()=>{
      
    }
    const hanldeSave=()=>{
        console.log(data)
        let formData = new FormData();
        formData.append('file',file)

          axios.post(UpsertOppUrl, formData)
    
            .then((res) => {
                console.log('task form Submission  response', res);             
            })
            .catch((error) => {
                console.log('task form Submission  error', error);
            })
    }

  return (
    <>
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map(header => (
              <TableCell align="right">{header.toUpperCase()}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(0,5).map((emp, index) => (
            <TableRow key={index}>
              {headers.map(header => (
                <TableCell align="right">{emp[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
     <div className='action-buttons'>
     <DialogActions sx={{ justifyContent: "space-between" }}>

    
                 <Button type='success' variant="contained" color="secondary" onClick={hanldeSave}>Save</Button>
                  
                 <Button type="reset" variant="contained" onClick={(e) => handleModal(false)}>Cancel</Button>                         
         

     </DialogActions>
 </div>
 </>
  );
}



export default PreviewDataload

