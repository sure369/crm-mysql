import React,{useState} from 'react'
import axios from 'axios';
import {
    Paper,Table,TableBody,TableCell,TableHead,TableRow,Typography,DialogActions,Button
} from "@mui/material";
import Notification from '../toast/Notification';
import { useEffect } from 'react';


const UpsertLeadUrl = `${process.env.REACT_APP_SERVER_URL}/dataloaderlead`;
const UpsertAccountUrl=`${process.env.REACT_APP_SERVER_URL}/dataloaderAccount`;
const UpsertOppUrl=`${process.env.REACT_APP_SERVER_URL}/dataloaderOpportunity`;

function PreviewUpsert({  data ,file,ModalClose}) {

  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

  const[upsertUrl,setUpsertUrl]=useState()

    const headers = Object.keys(data[0]);

    useEffect(()=>{
      if(window.location.href.includes('deals')){
        setUpsertUrl(UpsertOppUrl)
      }
      else if(window.location.href.includes('accounts')){
        setUpsertUrl(UpsertAccountUrl)
      }
      else if(window.location.href.includes('enquiries')){
        setUpsertUrl(UpsertLeadUrl)
      }
    })
    const handleModal=()=>{
      
    }
    const hanldeSave=()=>{
        console.log(data)
        let formData = new FormData();
        formData.append('file',file)

          axios.post(upsertUrl, formData)
    
            .then((res) => {
                console.log('data import res', res);   
                setNotify({
                  isOpen: true,
                  message: 'Records Inserted Successfully',
                  type: 'success'
                })
             setTimeout(()=>{
               window.location.reload();      
             },2000)
                    
            })
            .catch((error) => {
                console.log('data import error', error);
                setNotify({
                  isOpen: true,
                  message: 'Records not Inserted ',
                  type: 'error'
                })
                 setTimeout(()=>{
               window.location.reload();      
             },2000)
            })
    }

  return (
    <>
     <Notification notify={notify} setNotify={setNotify} />
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
                 <Button type='success' variant="contained" color="secondary" onClick={hanldeSave}>Upload</Button>
                 <Button type="reset" variant="contained" onClick={ModalClose}>Cancel</Button>                         
     </DialogActions>
 </div>
 </>
  );
}



export default PreviewUpsert

