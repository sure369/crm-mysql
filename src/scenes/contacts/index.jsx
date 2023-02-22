import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography, Modal, useTheme, Pagination, Tooltip } from "@mui/material";
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
import ToastNotification from '../toast/ToastNotification';
import DeleteConfirmDialog from '../toast/DeleteConfirmDialog';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';

const Contacts = () => {

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

 

  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);
    const pageCount = useGridSelector(apiRef, gridPageCountSelector);

    return (
      <Pagination
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    );
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


  const columns = [
    {
      field: "lastName", headerName: "Last Name",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "accountName", headerName: "Account Name",
      headerAlign: 'center', align: 'center', flex: 1,
      renderCell: (params) => {      
        if(params.row.accountDetails){
          return <div className="rowitem">
           {params.row.accountDetails.accountName}
            </div>
        }
        else{
          return <div className="rowitem">
             {null}
           </div>
        }
      },
    },
    {
      field: "phone", headerName: "Phone",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "leadSource", headerName: "Lead Source",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "email", headerName: "Email",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: 'actions', headerName: 'Actions', width: 400,
      headerAlign: 'center', align: 'center', flex: 1,
      renderCell: (params) => {
        return (
          <>
            {
              !showEmail ?
                <>
                  <IconButton style={{ padding: '20px', color: '#0080FF' }} >
                    <EditIcon onClick={(e) => handleOnCellClick(e, params.row)} />
                  </IconButton>
                  <IconButton style={{ padding: '20px', color: '#FF3333' }} >
                    <DeleteIcon onClick={(e) => onHandleDelete(e, params.row)} />
                  </IconButton>
                </>
                : ''
            }

          </>
        );
      }
    }
  ];


  return (
    <>

      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />


      <Box m="20px">
        <Header
          title="Contacts"
          subtitle="List of Contacts"
        />
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaderTitle": { 
              fontWeight: 'bold !important',
              overflow: 'visible !important'
           },
            "& .MuiDataGrid-virtualScroller": {
              // backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              // borderTop: "none",
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            }, 
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#CECEF0"
            },                     
            "& .C-MuiDataGrid-row-even":{
              backgroundColor: "#D7ECFF",
            }, 
            "& .C-MuiDataGrid-row-odd":{
              backgroundColor: "#F0F8FF",
            },
          }}
        >
           <div className='btn-test'>
              {
                showEmail ?
                  <>
                    <Tooltip title="Email">
                      <IconButton> <EmailIcon sx={{ color: '#DB4437' }} onClick={handlesendEmail} /> </IconButton>
                    </Tooltip>
                    <Tooltip title="Whatsapp">
                      <IconButton> <WhatsAppIcon sx={{ color: '#34A853' }} onClick={handlesendWhatsapp} /> </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Selected">
                      <IconButton> <DeleteIcon sx={{ color: '#FF3333' }} onClick={(e) => onHandleDelete(e,selectedRecordIds)} /> </IconButton>
                    </Tooltip>
                  </>
                   :
                  <Button  variant="contained" color="info" onClick={handleAddRecord} >
                    New
                  </Button>
                  
                  
              }
              </div>

          <DataGrid
            rows={records}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={7}
            rowsPerPageOptions={[7]}
            components={{
              Toolbar: GridToolbar,
              Pagination: CustomPagination,
            }}
            loading={fetchLoading}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'C-MuiDataGrid-row-even' : 'C-MuiDataGrid-row-odd'
            }
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(ids) => {
              var size = Object.keys(ids).length;
              size > 0 ? setShowEmail(true) : setShowEmail(false)
              console.log('checkbox selection ids', ids);
              setSelectedRecordIds(ids)
              const selectedIDs = new Set(ids);
              // const selectedRowRecords = records.filter((row) =>{
              // console.log(row)
              //  console.log( selectedIDs.has(row._id))
              // }
              // );
              const selectedRowRecords = records.filter((row) =>
                selectedIDs.has(row._id)
              );
               setSelectedRecordDatas(selectedRowRecords)
              console.log('selectedRowRecords', selectedRowRecords)
            }}
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

export default Contacts;

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

// const onConfirmDeleteRecord = (row) => {
//   console.log('onConfirmDeleteRecord row', (row.length))

//   if(row.length){
//     row.forEach(element => {
//    axios.post(urlDelete + element)
//     .then((res) => {
//       console.log('api delete response', res);
//       fetchRecords();
//       setNotify({
//         isOpen: true,
//         message: res.data,
//         type: 'success'
//       })
//     })
//     .catch((error) => {
//       console.log('api delete error', error);
//       setNotify({
//         isOpen: true,
//         message: error.message,
//         type: 'error'
//       })
//     })
//     });
//   }
//  else{
//   axios.post(urlDelete + row._id)
//     .then((res) => {
//       console.log('api delete response', res);
//       fetchRecords();
//       setNotify({
//         isOpen: true,
//         message: res.data,
//         type: 'success'
//       })
//     })
//     .catch((error) => {
//       console.log('api delete error', error);
//       setNotify({
//         isOpen: true,
//         message: error.message,
//         type: 'error'
//       })
//     })
//  }
//   setConfirmDialog({
//     ...confirmDialog,
//     isOpen: false
//   })

  
// }