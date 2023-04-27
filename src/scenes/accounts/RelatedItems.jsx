import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Box, Button, Typography, Modal
  , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails, Pagination, Menu, MenuItem
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ModalAccTask from "../tasks/ModalAccTask";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ToastNotification from "../toast/ToastNotification";
import { DataGrid, GridToolbar,
  gridPageCountSelector,gridPageSelector,
  useGridApiContext,useGridSelector} from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ModalConAccount from "../contacts/ModalConAccount";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import '../recordDetailPage/Form.css'
import { RequestServer } from "../api/HttpReq";


const AccountRelatedItems = ({ item }) => {

  const taskDeleteURL = `${process.env.REACT_APP_SERVER_URL}/deleteTask?code=`;
  const urlgetTaskbyAccountId = `${process.env.REACT_APP_SERVER_URL}/getTaskbyAccountId?searchId=`;
  const urlgetContactbyAccountId=`${process.env.REACT_APP_SERVER_URL}/getContactsbyAccountId?searchId=`;
  const contactDeleteURL=`${process.env.REACT_APP_SERVER_URL}/deleteContact?code=`;

  const navigate = useNavigate();
  const location = useLocation();
  
  const [accountRecordId, setAccountRecordId] = useState()
  const [relatedTask, setRelatedTask] = useState([]);
  const [relatedContact, setRelatedContact] = useState([]);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskItemsPerPage, setTaskItemsPerPage] = useState(2);
  const [taskPerPage, setTaskPerPage] = useState(1);
  const [taskNoOfPages, setTaskNoOfPages] = useState(0);

  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactItemsPerPage, setContactItemsPerPage] = useState(2);
  const [contactPerPage, setContactPerPage] = useState(1);
  const [contactNoOfPages, setContactNoOfPages] = useState(0);

  useEffect(() => {
    console.log('inside  acc related useEffect', location.state.record.item);
    setAccountRecordId(location.state.record.item._id)
    getTasksbyAccountId(location.state.record.item._id)
    getContactsbyAccountId(location.state.record.item._id)
  }, [])


  const getTasksbyAccountId = (accId) => {
  
    console.log('inside getTasks record Id', accId);

    RequestServer("post",urlgetTaskbyAccountId + accId,null,{})
    .then((res)=>{
      if(res.success){
        setRelatedTask(res.data);
        setTaskNoOfPages(Math.ceil(res.data.length / taskItemsPerPage));
        setTaskPerPage(1)
      }else{
        setRelatedTask([])
      }
    })
    .catch((err)=>{
      console.log('error task fetch', err)
    })

    // axios.post(urlgetTaskbyAccountId + accId)
    //   .then((res) => {
    //     console.log('response getTasks fetch', res);
    //     if (res.data.length > 0) {
    //       setRelatedTask(res.data);
    //       setTaskNoOfPages(Math.ceil(res.data.length / taskItemsPerPage));
    //       setTaskPerPage(1)
    //     }
    //     else {
    //       setRelatedTask([]);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log('error task fetch', error)
    //   })
  }

  const getContactsbyAccountId=(accId)=>{
    console.log('inside getContacts record Id', accId);

    RequestServer("post",urlgetContactbyAccountId + accId,null,{})
    .then((res)=>{
      if(res.success){
        setRelatedContact(res.data);
        setContactNoOfPages(Math.ceil(res.data.length / taskItemsPerPage));
        setContactPerPage(1)
      }else{
        setRelatedContact([])
      }
    })
    .catch((err)=>{
      console.log('error task fetch', err)
    })

    // axios.post(urlgetContactbyAccountId + accId)
    //   .then((res) => {
    //     console.log('response getContacts fetch', res);
    //     if (res.data.length > 0) {
    //       setRelatedContact(res.data);
    //       setContactNoOfPages(Math.ceil(res.data.length / contactItemsPerPage));
    //       setContactPerPage(1)
    //     }
    //     else {
    //       setRelatedContact([]);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log('error task fetch', error)
    //   })
  }

  const handletaskModalOpen = () => {
    setTaskModalOpen(true);
  }
  const handleTaskModalClose = () => {
    setTaskModalOpen(false);
    getTasksbyAccountId(accountRecordId)
  }
  const handleContactModalOpen = () => {
    setContactModalOpen(true);
  }
  const handleConatctModalClose = () => {
    setContactModalOpen(false);
    getContactsbyAccountId(accountRecordId)
  }

  const handleContactCardEdit = (e,row) => {
    console.log('selected record', row);
    const item = row;
    navigate(`/contactDetailPage/${item._id}`, { state: { record: { item } } })
  };

  const handleReqContactCardDelete = (e,row) => {

    e.stopPropagation();
    console.log('inside handleReqContactCardDelete fn')
        setConfirmDialog({
          isOpen:true,
          title:`Are you sure to delete this Record ?`,
          subTitle:"You can't undo this Operation",
          onConfirm:()=>{onConfirmContactCardDelete(row)}
        })
      }

    const  onConfirmContactCardDelete =(row)=>{
    console.log('req delete rec', row);

    RequestServer("post",contactDeleteURL+row._id)
    .then((res)=>{
      if(res.success){
        
        getContactsbyAccountId(accountRecordId)
        setMenuOpen(false)
        setNotify({
          isOpen:true,
          message:res.data,
          type:'success'
        })
      }
      else{
        console.log(res,"error in then")
        setNotify({
          isOpen: true,
          message: res.error.message,
          type: 'error'
        })
        
        getContactsbyAccountId(accountRecordId)
        setMenuOpen(false)
      }
    })
    .catch((error)=>{
      console.log('api delete error', error);
          setNotify({
            isOpen: true,
            message: error.message,
            type: 'error'
          })
    })
    .finally(()=>{
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false
      })
    })

    // axios.post(contactDeleteURL+ row._id)
    //   .then((res) => {
    //     console.log('api delete response', res);
    //     getContactsbyAccountId(accountRecordId)
    //     setNotify({
    //       isOpen: true,
    //       message: res.data,
    //       type: 'success'
    //   })
    //   setMenuOpen(false)
    //   setTimeout(
    //     getContactsbyAccountId(accountRecordId)
    //   )
    //   })
    //   .catch((error) => {
    //     console.log('api delete error', error);
    //     setNotify({
    //       isOpen: true,
    //       message: error.message,
    //       type: 'error'
    //   })
    //   })
    //   setConfirmDialog({
    //     ...confirmDialog,
    //     isOpen:false
    //   })
  };
 
  const handleTaskCardEdit = (row) => {
    console.log('selected record', row);
    const item = row;
    navigate(`/taskDetailPage/${item._id}`, { state: { record: { item } } })
  };

  const handleReqTaskCardDelete = (e,row) => {
    e.stopPropagation();
console.log('inside handleTaskCardDelete fn')
    setConfirmDialog({
      isOpen:true,
      title:`Are you sure to delete this Record ?`,
      subTitle:"You can't undo this Operation",
      onConfirm:()=>{onConfirmTaskCardDelete(row)}
    })
  }
  const onConfirmTaskCardDelete=(row)=>{
    console.log('req delete rec', row);
    RequestServer("post",taskDeleteURL+row._id ,{}, null)
    .then((res)=>{
      if(res.success){
        getTasksbyAccountId(accountRecordId)
        setNotify({
          isOpen:true,
          message:res.data,
          type:'success'
        })
        setMenuOpen(false)
      }
      else{
        console.log(res,"error in then")
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: 'error'
          })
          getContactsbyAccountId(accountRecordId)
          setMenuOpen(false)
      }
    })
    .catch((error)=>{
      console.log('api delete error', error);
          setNotify({
            isOpen: true,
            message: error.message,
            type: 'error'
          })
    })
    .finally(()=>{
      setConfirmDialog({
        ...confirmDialog,
        isOpen: false
      })
    })
    // axios.post(taskDeleteURL+ row._id)
    //   .then((res) => {
    //     console.log('api delete response', res);
    //     getTasksbyAccountId(accountRecordId)
    //     setNotify({
    //       isOpen: true,
    //       message: res.data,
    //       type: 'success'
    //   })
    //   setMenuOpen(false)
    //   })
    //   .catch((error) => {
    //     console.log('api delete error', error);
    //     setNotify({
    //       isOpen: true,
    //       message: error.message,
    //       type: 'error'
    //   })
    //   setTimeout(
    //     getTasksbyAccountId(accountRecordId)
    //   )
    //   })
    //   setConfirmDialog({
    //     ...confirmDialog,
    //     isOpen:false
    //   })
  };

  const handleChangeTaskPage = (event, value) => {
    setTaskPerPage(value);
  };

  // menu dropdown strart //menu pass rec
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSelectRec, setMenuSelectRec] = useState()
  const [menuOpen, setMenuOpen] = useState();

  const handleTaskMoreMenuClick = (item, event) => {
    setMenuSelectRec(item)
    setAnchorEl(event.currentTarget);
    setMenuOpen(true)

  };
  const handleMoreMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false)
  };
  // menu dropdown end

   // DATA GRID TABLE PAGINATION
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

const columns = [
  {
    field: "fullName", headerName: "Name",
    headerAlign: 'center', align: 'center', flex: 1, 
  },
  {
    field: "email", headerName: "Email",
    headerAlign: 'center', align: 'center', flex: 1,
  },
  {
    field: "phone", headerName: "Phone",
    headerAlign: 'center', align: 'center', flex: 1,
  },
  {
    field: 'actions', headerName: 'Actions',
    headerAlign: 'center', align: 'center', flex: 1, width: 400,
    renderCell: (params) => {
      return (
        <>
          <IconButton style={{ padding: '20px' }}>
            <EditIcon onClick={(e) => handleContactCardEdit(e, params.row)} />
          </IconButton>
          <IconButton style={{ padding: '20px' }}>
            <DeleteIcon onClick={(e) => handleReqContactCardDelete(e, params.row)} />
          </IconButton>
        </>
      );
    }
  }
 
];

  return (
    <>
     
     <ToastNotification notify={notify} setNotify={setNotify} />
     <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog}  moreModalClose={handleMoreMenuClose}/>


      <div style={{ textAlign: "center", marginBottom: "10px" }}>

        <h2> Related Items</h2>

      </div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Event Logs ({relatedTask.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div style={{ textAlign: "end", marginBottom: "5px" }}>
              <Button variant="contained" color="info" onClick={() => handletaskModalOpen()} >NEW EVENT</Button>
            </div>
            <Card dense compoent="span" >

              {

                relatedTask.length > 0 ?
                  relatedTask
                    .slice((taskPerPage - 1) * taskItemsPerPage, taskPerPage * taskItemsPerPage)
                    .map((item) => {
                      let   starDateConvert 
                      if(item.StartDate){

                        starDateConvert = new Date(item.StartDate).getUTCFullYear()
                      + '-' +  ('0'+ (new Date(item.StartDate).getUTCMonth() + 1)).slice(-2) 
                      + '-' + ('0'+ ( new Date(item.StartDate).getUTCDate())).slice(-2)  ||''
                      }


                      return (
                        <div >
                          <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
                            <div
                              key={item._id}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={10} md={10}>
                                  <div>Subject : {item.subject} </div>
                                  <div>Date&Time :{starDateConvert}</div>
                                  <div>Description : {item.description} </div>
                                </Grid>
                                <Grid item xs={2} md={2}>

                                  <IconButton>
                                    <MoreVertIcon onClick={(event) => handleTaskMoreMenuClick(item, event)} />
                                    <Menu
                                      anchorEl={anchorEl}
                                      open={menuOpen}
                                      onClose={handleMoreMenuClose}
                                      anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                      transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                    >
                                      <MenuItem onClick={() => handleTaskCardEdit(menuSelectRec)}>Edit</MenuItem>
                                      <MenuItem onClick={(e) => handleReqTaskCardDelete(e,menuSelectRec)}>Delete</MenuItem>
                                    </Menu>
                                  </IconButton>
                                </Grid>
                              </Grid>
                            </div>
                          </CardContent>
                        </div>

                      );
                    })
                  : ""
              }

            </Card>
            {
              relatedTask.length > 0 &&
              <Box display="flex" alignItems="center" justifyContent="center">
                <Pagination
                  count={taskNoOfPages}
                  page={taskPerPage}
                  onChange={handleChangeTaskPage}
                  defaultPage={1}
                  color="primary"
                  size="medium"
                  showFirstButton
                  showLastButton
                />
              </Box>
            }

          </Typography>
        </AccordionDetails>
      </Accordion>
     
{/* Contact table */}
<Accordion >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h4">Contact({relatedContact.length}) </Typography>
        </AccordionSummary>
        <AccordionDetails>
       
        <div style={{ textAlign: "end", marginBottom: "5px" }}>
              <Button variant="contained" color="info" onClick={() => handleContactModalOpen()} >Add Contact</Button>
            </div>
            {
              relatedContact.length>0 && 
              <Box sx={{ height: 315, width: '100%' }}>

              <DataGrid
                          rows={relatedContact}
                          columns={columns}
                          getRowId={(row) => row._id}
                          pageSize={4}
                          rowsPerPageOptions={[4]}
                          //  onCellClick={handleOnCellClick}
                          components={{ Pagination:CustomPagination}}
                         
                          disableColumnMenu
                          autoHeight={true}
                        />
     
        </Box>
            }
      

        </AccordionDetails>
      </Accordion>


      <Modal
        open={taskModalOpen}
        onClose={handleTaskModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(1px)" }}
      >
        <div className="modal">
          <ModalAccTask handleModal={handleTaskModalClose} />
        </div>
      </Modal>
  {/* Contact Modal*/}

  <Modal
        open={contactModalOpen}
        onClose={handleConatctModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(1px)"}}
      >
        {/* <Box sx={ModalStyle}> */}
        <div className="modal">
          <ModalConAccount  handleModal={handleConatctModalClose} />
        {/* </Box> */}
        </div>
      </Modal>

    </>
  )

}
export default AccountRelatedItems



// import React, { useEffect, useState, useRef } from "react";
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   Card, CardContent, Box, Button, Typography, Modal
//   , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails, Pagination, Menu, MenuItem
// } from "@mui/material";
// import axios from 'axios'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ModalAccTask from "../tasks/ModalAccTask";
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import ToastNotification from "../toast/ToastNotification";
// import { DataGrid, GridToolbar,
//   gridPageCountSelector,gridPageSelector,
//   useGridApiContext,useGridSelector} from "@mui/x-data-grid";
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import ModalConAccount from "../contacts/ModalConAccount";
// import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";

// const ModalStyle = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 600,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
// };

// const AccountRelatedItems = ({ item }) => {

//   const taskDeleteURL = `${process.env.REACT_APP_SERVER_URL}/deleteTask?code=`;
//   const urlgetTaskbyAccountId = `${process.env.REACT_APP_SERVER_URL}/getTaskbyAccountId?searchId=`;
//   const urlgetContactbyAccountId=`${process.env.REACT_APP_SERVER_URL}/getContactsbyAccountId?searchId=`;
//   const contactDeleteURL=`${process.env.REACT_APP_SERVER_URL}/deleteContact?code=`;

//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [accountRecordId, setAccountRecordId] = useState()
//   const [relatedTask, setRelatedTask] = useState([]);
//   const [relatedContact, setRelatedContact] = useState([]);
//   const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
//   const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

//   const [taskModalOpen, setTaskModalOpen] = useState(false);
//   const [taskItemsPerPage, setTaskItemsPerPage] = useState(2);
//   const [taskPerPage, setTaskPerPage] = useState(1);
//   const [taskNoOfPages, setTaskNoOfPages] = useState(0);

//   const [contactModalOpen, setContactModalOpen] = useState(false);
//   const [contactItemsPerPage, setContactItemsPerPage] = useState(2);
//   const [contactPerPage, setContactPerPage] = useState(1);
//   const [contactNoOfPages, setContactNoOfPages] = useState(0);

//   useEffect(() => {
//     console.log('inside  acc related useEffect', location.state.record.item);
//     setAccountRecordId(location.state.record.item._id)
//     getTasksbyAccountId(location.state.record.item._id)
//     getContactsbyAccountId(location.state.record.item._id)
//   }, [])


//   const getTasksbyAccountId = (accId) => {
  
//     console.log('inside getTasks record Id', accId);

//     axios.post(urlgetTaskbyAccountId + accId)
//       .then((res) => {
//         console.log('response getTasks fetch', res);
//         if (res.data.length > 0) {
//           setRelatedTask(res.data);
//           setTaskNoOfPages(Math.ceil(res.data.length / taskItemsPerPage));
//           setTaskPerPage(1)
//         }
//         else {
//           setRelatedTask([]);
//         }
//       })
//       .catch((error) => {
//         console.log('error task fetch', error)
//       })
//   }

//   const getContactsbyAccountId=(accId)=>{
//     console.log('inside getContacts record Id', accId);

//     axios.post(urlgetContactbyAccountId + accId)
//       .then((res) => {
//         console.log('response getContacts fetch', res);
//         if (res.data.length > 0) {
//           setRelatedContact(res.data);
//           setContactNoOfPages(Math.ceil(res.data.length / contactItemsPerPage));
//           setContactPerPage(1)
//         }
//         else {
//           setRelatedContact([]);
//         }
//       })
//       .catch((error) => {
//         console.log('error task fetch', error)
//       })
//   }

//   const handletaskModalOpen = () => {
//     setTaskModalOpen(true);
//   }
//   const handleTaskModalClose = () => {
//     setTaskModalOpen(false);
//     getTasksbyAccountId(accountRecordId)
//   }
//   const handleContactModalOpen = () => {
//     setContactModalOpen(true);
//   }
//   const handleConatctModalClose = () => {
//     setContactModalOpen(false);
//     getContactsbyAccountId(accountRecordId)
//   }

//   const handleContactCardEdit = (e,row) => {
//     console.log('selected record', row);
//     const item = row;
//     navigate("/contactDetailPage", { state: { record: { item } } })
//   };

//   const handleReqContactCardDelete = (e,row) => {

//     e.stopPropagation();
//     console.log('inside handleReqContactCardDelete fn')
//         setConfirmDialog({
//           isOpen:true,
//           title:`Are you sure to delete this Record ?`,
//           subTitle:"You can't undo this Operation",
//           onConfirm:()=>{onConfirmContactCardDelete(row)}
//         })
//       }

//     const  onConfirmContactCardDelete =(row)=>{
//     console.log('req delete rec', row);
//     axios.post(contactDeleteURL+ row._id)
//       .then((res) => {
//         console.log('api delete response', res);
//         getContactsbyAccountId(accountRecordId)
//         setNotify({
//           isOpen: true,
//           message: res.data,
//           type: 'success'
//       })
//       setMenuOpen(false)
//       setTimeout(
//         getContactsbyAccountId(accountRecordId)
//       )
//       })
//       .catch((error) => {
//         console.log('api delete error', error);
//         setNotify({
//           isOpen: true,
//           message: error.message,
//           type: 'error'
//       })
//       })
//       setConfirmDialog({
//         ...confirmDialog,
//         isOpen:false
//       })
//   };
 
//   const handleTaskCardEdit = (row) => {
//     console.log('selected record', row);
//     const item = row;
//     navigate("/taskDetailPage", { state: { record: { item } } })
//   };

//   const handleReqTaskCardDelete = (e,row) => {
//     e.stopPropagation();
// console.log('inside handleTaskCardDelete fn')
//     setConfirmDialog({
//       isOpen:true,
//       title:`Are you sure to delete this Record ?`,
//       subTitle:"You can't undo this Operation",
//       onConfirm:()=>{onConfirmTaskCardDelete(row)}
//     })
//   }
//   const onConfirmTaskCardDelete=(row)=>{
//     console.log('req delete rec', row);
//     axios.post(taskDeleteURL+ row._id)
//       .then((res) => {
//         console.log('api delete response', res);
       
//         setNotify({
//           isOpen: true,
//           message: res.data,
//           type: 'success'
//       })
//       setMenuOpen(false)
//       setTimeout(
//         getTasksbyAccountId(accountRecordId)
//       )
//       })
//       .catch((error) => {
//         console.log('api delete error', error);
//         setNotify({
//           isOpen: true,
//           message: error.message,
//           type: 'error'
//       })
      
//       })
//       setConfirmDialog({
//         ...confirmDialog,
//         isOpen:false
//       })
//   };

//   const handleChangeTaskPage = (event, value) => {
//     setTaskPerPage(value);
//   };

//   // menu dropdown strart //menu pass rec
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuSelectRec, setMenuSelectRec] = useState()
//   const [menuOpen, setMenuOpen] = useState();

//   const handleTaskMoreMenuClick = (item, event) => {
//     setMenuSelectRec(item)
//     setAnchorEl(event.currentTarget);
//     setMenuOpen(true)

//   };
//   const handleMoreMenuClose = () => {
//     setAnchorEl(null);
//     setMenuOpen(false)
//   };
//   // menu dropdown end

//    // DATA GRID TABLE PAGINATION
//  function CustomPagination() {
//   const apiRef = useGridApiContext();
//   const page = useGridSelector(apiRef, gridPageSelector);
//   const pageCount = useGridSelector(apiRef, gridPageCountSelector);

//   return (
//     <Pagination
//       color="primary"
//       count={pageCount}
//       page={page + 1}
//       onChange={(event, value) => apiRef.current.setPage(value - 1)}
//     />
//   );
// }

// const columns = [
//   {
//     field: "fullName", headerName: "Name",
//     headerAlign: 'center', align: 'center', flex: 1, 
//   },
//   {
//     field: "email", headerName: "Email",
//     headerAlign: 'center', align: 'center', flex: 1,
//   },
//   {
//     field: "phone", headerName: "Phone",
//     headerAlign: 'center', align: 'center', flex: 1,
//   },
//   {
//     field: 'actions', headerName: 'Actions',
//     headerAlign: 'center', align: 'center', flex: 1, width: 400,
//     renderCell: (params) => {
//       return (
//         <>
//           <IconButton style={{ padding: '20px' }}>
//             <EditIcon onClick={(e) => handleContactCardEdit(e, params.row)} />
//           </IconButton>
//           <IconButton style={{ padding: '20px' }}>
//             <DeleteIcon onClick={(e) => handleReqContactCardDelete(e, params.row)} />
//           </IconButton>
//         </>
//       );
//     }
//   }
 
// ];

//   return (
//     <>
     
//      <ToastNotification notify={notify} setNotify={setNotify} />
//      <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog}  moreModalClose={handleMoreMenuClose}/>


//       <div style={{ textAlign: "center", marginBottom: "10px" }}>

//         <h3> Related Items</h3>

//       </div>
//       <Accordion>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel1a-content"
//           id="panel1a-header"
//         >
//           <Typography variant="h4">Task ({relatedTask.length})</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Typography>
//             <div style={{ textAlign: "end", marginBottom: "5px" }}>
//               <Button variant="contained" color="info" onClick={() => handletaskModalOpen()} >New Task</Button>
//             </div>
//             <Card dense compoent="span" >

//               {

//                 relatedTask.length > 0 ?
//                   relatedTask
//                     .slice((taskPerPage - 1) * taskItemsPerPage, taskPerPage * taskItemsPerPage)
//                     .map((item) => {
//                       let   starDateConvert 
//                       if(item.StartDate){

//                         starDateConvert = new Date(item.StartDate).getUTCFullYear()
//                       + '-' +  ('0'+ (new Date(item.StartDate).getUTCMonth() + 1)).slice(-2) 
//                       + '-' + ('0'+ ( new Date(item.StartDate).getUTCDate())).slice(-2)  ||''
//                       }


//                       return (
//                         <div >
//                           <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
//                             <div
//                               key={item._id}
//                             >
//                               <Grid container spacing={2}>
//                                 <Grid item xs={10} md={10}>
//                                   <div>Subject : {item.subject} </div>
//                                   <div>Date&Time :{starDateConvert}</div>
//                                   <div>Description : {item.description} </div>
//                                 </Grid>
//                                 <Grid item xs={2} md={2}>

//                                   <IconButton>
//                                     <MoreVertIcon onClick={(event) => handleTaskMoreMenuClick(item, event)} />
//                                     <Menu
//                                       anchorEl={anchorEl}
//                                       open={menuOpen}
//                                       onClose={handleMoreMenuClose}
//                                       anchorOrigin={{
//                                         vertical: 'top',
//                                         horizontal: 'left',
//                                       }}
//                                       transformOrigin={{
//                                         vertical: 'top',
//                                         horizontal: 'left',
//                                       }}
//                                     >
//                                       <MenuItem onClick={() => handleTaskCardEdit(menuSelectRec)}>Edit</MenuItem>
//                                       <MenuItem onClick={(e) => handleReqTaskCardDelete(e,menuSelectRec)}>Delete</MenuItem>
//                                     </Menu>
//                                   </IconButton>
//                                 </Grid>
//                               </Grid>
//                             </div>
//                           </CardContent>
//                         </div>

//                       );
//                     })
//                   : ""
//               }

//             </Card>
//             {
//               relatedTask.length > 0 &&
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <Pagination
//                   count={taskNoOfPages}
//                   page={taskPerPage}
//                   onChange={handleChangeTaskPage}
//                   defaultPage={1}
//                   color="primary"
//                   size="medium"
//                   showFirstButton
//                   showLastButton
//                 />
//               </Box>
//             }

//           </Typography>
//         </AccordionDetails>
//       </Accordion>
     
// {/* Contact table */}
// <Accordion >
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel2a-content"
//           id="panel2a-header"
//         >
//           <Typography variant="h4">Conatct({relatedContact.length}) </Typography>
//         </AccordionSummary>
//         <AccordionDetails>
       
//         <div style={{ textAlign: "end", marginBottom: "5px" }}>
//               <Button variant="contained" color="info" onClick={() => handleContactModalOpen()} >Add Contact</Button>
//             </div>
//             {
//               relatedContact.length>0 && 
//               <Box sx={{ height: 315, width: '100%' }}>

//               <DataGrid
//                           rows={relatedContact}
//                           columns={columns}
//                           getRowId={(row) => row._id}
//                           pageSize={4}
//                           rowsPerPageOptions={[4]}
//                           //  onCellClick={handleOnCellClick}
//                           components={{ Pagination:CustomPagination}}
                         
//                           disableColumnMenu
//                           autoHeight={true}
//                         />
     
//         </Box>
//             }
      

//         </AccordionDetails>
//       </Accordion>

//       <Modal
//         open={taskModalOpen}
//         onClose={handleTaskModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         sx={{ backdropFilter: "blur(2px)" }}
//       >
//         <Box sx={ModalStyle}>
//           <ModalAccTask handleModal={handleTaskModalClose} />
//         </Box>
//       </Modal>

//   {/* Contact Modal*/}

//   <Modal
//         open={contactModalOpen}
//         onClose={handleConatctModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         sx={{ backdropFilter: "blur(2px)" }}
//       >
//         <Box sx={ModalStyle}>
//           <ModalConAccount  handleModal={handleConatctModalClose} />
//         </Box>
//       </Modal>

//     </>
//   )

// }
// export default AccountRelatedItems

