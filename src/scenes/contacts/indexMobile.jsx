import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, 
    Modal, useTheme, Pagination, Tooltip ,
Card,CardActionArea,CardContent} from "@mui/material";
import {
  DataGrid, GridToolbar,
  gridPageCountSelector, gridPageSelector,
  useGridApiContext, useGridSelector
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EmailModalPage from '../recordDetailPage/EmailModalPage';
import WhatAppModalPage from '../recordDetailPage/WhatsAppModalPage';
import Notification from '../toast/Notification';
import ConfirmDialog from '../toast/ConfirmDialog';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

const ContactsMobile = () => {

  const urlContact = `${process.env.REACT_APP_SERVER_URL}/contacts`;
  const urlDelete = `${process.env.REACT_APP_SERVER_URL}/deleteContact?code=`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  //email,Whatsapp
  const [showEmail, setShowEmail] = useState(false)
  const [selectedRecordIds, setSelectedRecordIds] = useState()
  const [selectedRecordDatas, setSelectedRecordDatas] = useState()
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false)

  // notification
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  //dialog
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);

  useEffect(() => {
    fetchRecords();

  }, []);

  const fetchRecords = () => {
    axios.post(urlContact)
      .then(
        (res) => {
          console.log("res Contact records", res);
          if (res.data.length > 0 && (typeof (res.data) !== 'string')) {
            setRecords(res.data);
            setFetchLoading(false)
            setNoOfPages(Math.ceil(res.data.length / itemsPerPage));
          }
          else {
            setRecords([]);
            setFetchLoading(false)
          }
        }
      )
      .catch((error) => {
        console.log('error', error);
        setFetchLoading(false)
      })
  }

  const handleAddRecord = () => {
    navigate("/contactDetailPage", { state: { record: {} } })
  };

  const handleOnCellClick = (e, row) => {
    console.log('selected record', row);
    const item = row;
    navigate("/contactDetailPage", { state: { record: { item } } })
  };


  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log('req delete rec', row);

    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => { onConfirmDeleteRecord(row) }
    })
  }

  const onConfirmDeleteRecord = (row) => {
    if(row.length){
      row.forEach(element => {
        onebyoneDelete(element)
      });
    }
   else{
    onebyoneDelete(row._id)
   }
  }

  const onebyoneDelete=(row)=>{
    console.log('one by on delete',row)

    axios.post(urlDelete + row)
    .then((res) => {
      console.log('api delete response', res);
      fetchRecords();
      setNotify({
        isOpen: true,
        message: res.data,
        type: 'success'
      })
    })
    .catch((error) => {
      console.log('api delete error', error);
      setNotify({
        isOpen: true,
        message: error.message,
        type: 'error'
      })
    })

    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    })
  }

  const handlesendEmail = () => {
    console.log('inside email')
    console.log('selectedRecordIds', selectedRecordIds);
    setEmailModalOpen(true)
  }

  const setEmailModalClose = () => {
    setEmailModalOpen(false)
  }

  const handlesendWhatsapp = () => {
    console.log('inside whats app')
    console.log('selectedRecordIds', selectedRecordIds);
    setWhatsAppModalOpen(true)
  }

  const setWhatAppModalClose = () => {
    setWhatsAppModalOpen(false)
  }



  const handleChangePage = (event, value) => {
    setPage(value);
  };


  return (
    <>

      <Notification notify={notify} setNotify={setNotify} />
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />


      <Box m="20px">
        <Header
          title="Contacts"
          subtitle="List of Contacts"
        />
        <div className='btn-test'>
            <Button variant="contained" color="info" onClick={handleAddRecord}>
                New
            </Button>

        </div>

      <Card dense compoent="span" sx={{ bgcolor: "white" }}>
            { records.length>0?
            records
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((item) => {
                return (
                  <div>
                    <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
                      <div
                        key={item._id}
                        button
                        onClick={(e) => handleOnCellClick(e,item)}
                      >
                        {/* //()=>setRecordDetailId(item.Id) */}
                        <h1>{item.Name} </h1>
                        <div>Name : {item.fullName} </div>
                        <div>Account Name :{item.accountDetails.accountName} </div>
                        <div>Phone : {item.phone} </div>
                        <div>Email : {item.email} </div>
                        
                      </div>
                    </CardContent>
                  </div>
                );
              })
            :"No Data"
            }
          </Card>

          <Box 
           sx={{
                    margin: "auto",
                    width: "fit-content",
                    alignItems: "center",
                    // justifyContent:'space-between'
                }}>
            <Pagination
              count={noOfPages}
              page={page}
              onChange={handleChangePage}
              defaultPage={1}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{justifyContent:'center'}}
            />
          </Box>

          </Box>

      <Modal
        open={emailModalOpen}
        onClose={setEmailModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalBoxstyle}>
          <EmailModalPage data={selectedRecordDatas} handleModal={setEmailModalClose} bulkMail={true} />
        </Box>
      </Modal>

      <Modal
        open={whatsAppModalOpen}
        onClose={setWhatAppModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalBoxstyle}>
          <WhatAppModalPage data={selectedRecordDatas} handleModal={setWhatAppModalClose} bulkMail={true} />
        </Box>
      </Modal>

    </>
  );
}

export default ContactsMobile;

const ModalBoxstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
};

