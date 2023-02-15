import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Box, Button, Typography, Modal
  , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails, Pagination, Menu, MenuItem
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios'
import ModalLeadTask from "../tasks/ModalLeadTask";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import PreviewFile from "../formik/PreviewFile";
import { string } from "yup/lib/locale";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

const TaskRelatedItems = ({ item }) => {

  const urlDelete =`${process.env.REACT_APP_SERVER_URL}/deleteTask?code=`;

  const navigate = useNavigate();
  const location = useLocation();
  const [relatedTask, setRelatedTask] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [taskRecordId, setTaskRecordId] = useState()

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [alertSeverity, setAlertSeverity] = useState();

  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);

  const [resFiles,setResFiles]=useState()

  useEffect(() => {
    console.log(' Task RecordId', location.state.record.item);
    if(location.state.record.item){
        setTaskRecordId(location.state.record.item._id)
        getFiles();
    }
   
  }, [])


  const getFiles =()=>{
    const urll =`${process.env.REACT_APP_SERVER_URL}/files`

    axios.post(urll)
    .then((res)=>{
        console.log('files response',res)
        setResFiles(res.data[1].files)

       
        // setResFiles( Buffer.from(res.data, "binary").toString("base64"))

        // const imageBlob = res.blob();
        // const imageObjURL =URL.createObjectURL(imageBlob)
        // setResFiles(imageObjURL)


        //  setResFiles(res.data[0].files.filename)
        //  setResFiles(res.data[0].files.filename)
                // setResFiles(URL.createObjectURL(res.data[0].files));
    })
    .catch((error)=>{
        console.log('files error',error);
    })

  }


  const handleModalOpen = () => {

    setModalOpen(true);
  }
  const handleModalClose = () => {

    setModalOpen(false);
  }


  const toastCloseCallback = () => {
    setShowAlert(false)
  }

  const handleChangePage = (event, value) => {
    setPage(value);
  };


  return (
    <>
     
      <div style={{ textAlign: "center", marginBottom: "10px" }}>

        <h3> Related Items ({relatedTask.length})</h3>

      </div>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Notes and Attachments </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>

          {/* <img  src={resFiles} /> 
          <img src={`/uploads/${resFiles}`} /> */}
         
         {/* < img src={`data:;base64,${resFiles}`} /> */}
         {/* <img src={`data:image/jpeg;charset=utf-8;base64,${resFiles}`} /> */}
          {/* <img src={``${process.env.REACT_APP_SERVER_URL}/${resFiles}`} alt="img"/> */}

          
         {/* <PreviewFile file={``${process.env.REACT_APP_SERVER_URL}/${resFiles}`} />} */}

          </Typography>
        </AccordionDetails>
      </Accordion>
     
      <Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h4">Related Records</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Need to work
          </Typography>
        </AccordionDetails>
      </Accordion>


      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <ModalLeadTask handleModal={handleModalClose} />
        </Box>
      </Modal>

    </>
  )


}
export default TaskRelatedItems

