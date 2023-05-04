import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Box, Button, Typography, Modal
  , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails, Pagination, Menu, MenuItem
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ModalInventoryOpportunity from "../opportunities/ModalInventoryOpp";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import ModalInventoryAccount from "../accounts/ModalAccountInventory";
import '../recordDetailPage/Form.css'
import { RequestServer } from "../api/HttpReq";
import { getPermissions } from "../Auth/getPermission";
import NoAccess from "../Errors/NoAccess";
import NoAccessCard from "../Errors/NoAccessCard";

const InventoryRelatedItems = ({ item }) => {

  const opportunityDeleteURL = `${process.env.REACT_APP_SERVER_URL}/deleteOpportunity?code=`;
  const accountDeleteURL = `${process.env.REACT_APP_SERVER_URL}/deleteAccount?code=`;
  const urlgetOpportunitiesbyInvid = `${process.env.REACT_APP_SERVER_URL}/getOpportunitiesbyInvid?searchId=`;
  const urlgetAccountsbyInvid = `${process.env.REACT_APP_SERVER_URL}/getAccountbyInventory?searchId=`;

  const navigate = useNavigate();
  const location = useLocation();

  const [inventoryRecordId, setInventoryRecordId] = useState()
  const [realtedOpportunity, setRealtedOpportunity] = useState([]);
  const [relatedAccount, setRelatedAccount] = useState([]);

  const [opportunityModalOpen, setOpportunityModalOpen] = useState(false);
  const [opportunityItemsPerPage, setOpportunityItemsPerPage] = useState(2);
  const [opportunityPerPage, setOpportunityPerPage] = useState(1);
  const [opportunityNoOfPages, setOpportunityNoOfPages] = useState(0);

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [accountItemsPerPage, setAccountItemsPerPage] = useState(2);
  const [accountPerPage, setAccountPerPage] = useState(1);
  const [accountNoOfPages, setAccountNoOfPages] = useState(0);


  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [permissionValuesAccount,setPermissionValuesAccount]=useState({})
  const [permissionValuesOpportunity,setPermissionValuesOpportunity]=useState({})



  useEffect(() => {
    console.log('related Inventories', location.state.record.item);

    setInventoryRecordId(location.state.record.item._id)
    getOpportunitiesbyInvId(location.state.record.item._id)
    getAccountsbyInvId(location.state.record.item._id)

    const getAccountPermission=getPermissions("Account")
    setPermissionValuesAccount(getAccountPermission)

    const getOpportunityPermission=getPermissions("Opportunity")
    setPermissionValuesOpportunity(getOpportunityPermission)

  }, [])

  const getOpportunitiesbyInvId = (recId) => {
    RequestServer("post", urlgetOpportunitiesbyInvid + recId)
      .then((res) => {
        if (res.success) {
          setRealtedOpportunity(res.data);
          setOpportunityNoOfPages(Math.ceil(res.data.length / opportunityItemsPerPage));
          setOpportunityPerPage(1)
        }else{
          setRealtedOpportunity([])
        }
      })
      .catch((err)=>{
        console.log('error getOpportunitiesbyInvId fetch', err)
      })
  }

  const getAccountsbyInvId = (InventoryId) => {
    RequestServer("post", urlgetAccountsbyInvid + InventoryId)
    .then((res) => {
      if (res.success) {
        setRelatedAccount(res.data);
        setAccountNoOfPages(Math.ceil(res.data.length / accountItemsPerPage));
        setAccountPerPage(1)
      }else{
        setRelatedAccount([])
      }
    })
    .catch((err)=>{
      console.log('error getAccountsbyInvId fetch', err)
    })
  }


  const handleOpportunityCardEdit = (row) => {

    console.log('selected record', row);
    const item = row;
    navigate(`/opportunityDetailPage/${item._id}`, { state: { record: { item } } })
  };

  const handleReqOpportunityCardDelete = (e, row) => {

    e.stopPropagation();
    console.log('inside handleTaskCardDelete fn')
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => { onConfirmOpportunityCardDelete(row) }
    })
  }

  const onConfirmOpportunityCardDelete = (row) => {
    console.log('req delete rec id', row._id);

    RequestServer("post",opportunityDeleteURL+row._id)
    .then((res)=>{
      if(res.success){
        setOppMenuOpen(false)
        getOpportunitiesbyInvId(inventoryRecordId)
        setNotify({
          isOpen:true,
          message:res.data,
          type:'success'
        })
      }
      else{
        console.log(res,"error in then")
        setOppMenuOpen(false)
        getOpportunitiesbyInvId(inventoryRecordId)
        setNotify({
          isOpen: true,
          message: res.error.message,
          type: 'error'
        })
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
  };

  const handleAccountCardEdit = (row) => {
    console.log('selected record', row);
    const item = row;
    navigate(`/accountDetailPage/${item._id}`, { state: { record: { item } } })
  };


  const handleReqAccountCardDelete = (e, row) => {

    e.stopPropagation();
    console.log('inside handleTaskCardDelete fn')
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => { onConfirmAccountCardDelete(row) }
    })
  }

  const onConfirmAccountCardDelete = (row) => {
    console.log('req delete rec', row);
    RequestServer("post",accountDeleteURL+row._id)
    .then((res)=>{
      if(res.success){
        setAccountMenuOpen(false)
        getAccountsbyInvId(inventoryRecordId)
        setNotify({
          isOpen:true,
          message:res.data,
          type:'success'
        })
      }
      else{
        console.log(res,"error in then")
        setAccountMenuOpen(false)
        getAccountsbyInvId(inventoryRecordId)
        setNotify({
          isOpen: true,
          message: res.error.message,
          type: 'error'
        })
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
  };



  const handleChangeAccountPage = (event, value) => {
    setAccountPerPage(value);
  };


  const handleChangeOpportunityPage = (event, value) => {
    setOpportunityPerPage(value)
  }
  const handleOpportunityModalOpen = () => {
    setOpportunityModalOpen(true);
  }

  const handleOpportunityModalClose = () => {
    setOpportunityModalOpen(false);
    getOpportunitiesbyInvId(inventoryRecordId)
    getAccountsbyInvId(inventoryRecordId)
  }
  const handleAccountModalOpen = () => {
    setAccountModalOpen(true)
  }
  const handleAccountModalClose = () => {
    setAccountModalOpen(false)
    getOpportunitiesbyInvId(inventoryRecordId)
    getAccountsbyInvId(inventoryRecordId)
  }

  // Task menu dropdown strart 
  const [oppAnchorEl, setOppAnchorEl] = useState(null);
  const [oppMenuSelectRec, setOppMenuSelectRec] = useState()
  const [oppMenuOpen, setOppMenuOpen] = useState();

  const handleOpportunityMoreMenuClick = (item, event) => {
    setOppMenuSelectRec(item)
    setOppAnchorEl(event.currentTarget);
    setOppMenuOpen(true)

  };
  const handleOpportunityMoreMenuClose = () => {
    setOppAnchorEl(null);
    setOppMenuOpen(false)
    setAccountAnchorEl(null);
    setAccountMenuOpen(false)
  };
  // menu dropdown end

  // Account menu dropdown strart //menu pass rec
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [accountMenuSelectRec, setAccountMenuSelectRec] = useState()
  const [accountMenuOpen, setAccountMenuOpen] = useState();

  const handleAccountMoreMenuClick = (item, event) => {
    console.log('handle OPP MoreMenu Click  item', item)

    setAccountMenuSelectRec(item)
    setAccountAnchorEl(event.currentTarget);
    setAccountMenuOpen(true)

  };
  const handleAccountMoreMenuClose = () => {
    setAccountMenuSelectRec()
    setAccountAnchorEl(null);
    setAccountMenuOpen(false)

  };
  // menu dropdown end

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} moreModalClose={handleOpportunityMoreMenuClose} />

      <div style={{ textAlign: "center", marginBottom: "10px" }}>

        <h2> Related Items</h2>

      </div>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Deal ({realtedOpportunity.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {
              permissionValuesOpportunity.read? <>
             
            <div style={{ textAlign: "end", marginBottom: "5px" }}>
              {
                permissionValuesOpportunity.create &&              
                <Button variant="contained" color="info" onClick={() => handleOpportunityModalOpen()} >Add Deal</Button>
              }
              </div>
            <Card dense compoent="span" >
              {
                realtedOpportunity.length > 0 ?
                  realtedOpportunity
                    .slice((opportunityPerPage - 1) * opportunityItemsPerPage, opportunityPerPage * opportunityItemsPerPage)
                    .map((item) => {

                      let starDateConvert
                      if (item.closeDate) {
                        starDateConvert = new Date(item.closeDate).getUTCFullYear()
                          + '-' + ('0' + (new Date(item.closeDate).getUTCMonth() + 1)).slice(-2)
                          + '-' + ('0' + (new Date(item.closeDate).getUTCDate())).slice(-2) || ''
                      }

                      return (
                        <div >

                          <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
                            <div
                              key={item._id}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={10} md={10}>
                                  <div>Name : {item.opportunityName} </div>
                                  <div>Stage :{item.stage} </div>
                                  <div>Close Date : {starDateConvert} </div>
                                </Grid>
                                <Grid item xs={2} md={2}>

                                  <IconButton>
                                    <MoreVertIcon onClick={(event) => handleOpportunityMoreMenuClick(item, event)} />
                                    <Menu
                                      anchorEl={oppAnchorEl}
                                      open={oppMenuOpen}
                                      onClose={handleOpportunityMoreMenuClose}
                                      anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                      transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                    >{
                                      permissionValuesOpportunity.edit ?
                                      <MenuItem onClick={() => handleOpportunityCardEdit(oppMenuSelectRec)}>Edit</MenuItem>
                                     :
                                     <MenuItem onClick={() => handleOpportunityCardEdit(oppMenuSelectRec)}>View</MenuItem>
                                    }
                                    {
                                      permissionValuesOpportunity.delete &&                                    
                                      <MenuItem onClick={(e) => handleReqOpportunityCardDelete(e, oppMenuSelectRec)}>Delete</MenuItem>
                                    }
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
              realtedOpportunity.length > 0 &&
              <Box display="flex" alignItems="center" justifyContent="center">
                <Pagination
                  count={opportunityNoOfPages}
                  page={opportunityPerPage}
                  onChange={handleChangeOpportunityPage}
                  defaultPage={1}
                  color="primary"
                  size="medium"
                  showFirstButton
                  showLastButton
                />
              </Box>
            }
             </> :<NoAccessCard/>
            }
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Accounts ({relatedAccount.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {
              permissionValuesAccount.read ? <>
            
            <div style={{ textAlign: "end", marginBottom: "5px" }}>
              {
                permissionValuesAccount.create &&             
              <Button variant="contained" color="info" onClick={() => handleAccountModalOpen()} >Add Account</Button>
            }
              </div>
            <Card dense compoent="span" >

              {
                relatedAccount.length > 0 ?
                  relatedAccount
                    .slice((accountPerPage - 1) * accountItemsPerPage, accountPerPage * accountItemsPerPage)
                    .map((item) => {
                      return (
                        <div >
                          <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
                            <div
                              key={item._id}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={10} md={10}>
                                  <div>Name : {item.accountName} </div>
                                  <div>Account Number :{item.accountNumber} </div>
                                  <div>Rating : {item.rating} </div>
                                </Grid>
                                <Grid item xs={2} md={2}>
                                  <IconButton>
                                    <MoreVertIcon onClick={(event) => handleAccountMoreMenuClick(item, event)} />
                                    <Menu
                                      anchorEl={accountAnchorEl}
                                      open={accountMenuOpen}
                                      onClose={handleAccountMoreMenuClose}
                                      anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                      transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                      }}
                                    >
                                      {
                                        permissionValuesAccount.edit ?
                                        <MenuItem onClick={() => handleAccountCardEdit(accountMenuSelectRec)}>Edit</MenuItem>
                                     :
                                     <MenuItem onClick={() => handleAccountCardEdit(accountMenuSelectRec)}>View</MenuItem>                                     
                                      }
                                      {
                                        permissionValuesAccount.delete &&                                     
                                      <MenuItem onClick={(e) => handleReqAccountCardDelete(e, accountMenuSelectRec)}>Delete</MenuItem>
                                    }
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
              relatedAccount.length > 0 &&
              <Box display="flex" alignItems="center" justifyContent="center">
                <Pagination
                  count={accountNoOfPages}
                  page={accountPerPage}
                  onChange={handleChangeAccountPage}
                  defaultPage={1}
                  color="primary"
                  size="medium"
                  showFirstButton
                  showLastButton
                />
              </Box>
            }
              </> :<NoAccessCard/>
            }
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Modal
        open={opportunityModalOpen}
        onClose={handleOpportunityModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(1px)" }}
      >
        <div className="modal">
          {/* <Box sx={ModalStyle}> */}
          <ModalInventoryOpportunity handleModal={handleOpportunityModalClose} />
          {/* </Box> */}
        </div>
      </Modal>

      <Modal
        open={accountModalOpen}
        onClose={handleAccountModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(1px)" }}
      >
        <div className="modal">
          {/* <Box sx={ModalStyle}> */}
          <ModalInventoryAccount handleModal={handleAccountModalClose} />
          {/* </Box> */}
        </div>
      </Modal>


    </>
  )

}
export default InventoryRelatedItems




// import React, { useEffect, useState, useRef } from "react";
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//     Card, CardContent, Box, Button, Typography, Modal
//     , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails, Pagination, Menu, MenuItem
// } from "@mui/material";
// import axios from 'axios'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import ModalInventoryOpportunity from "../opportunities/ModalInventoryOpp";
// import ToastNotification from "../toast/ToastNotification";
// import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
// import ModalInventoryAccount from "../accounts/ModalAccountInventory";


// const ModalStyle = {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 600,
//     bgcolor: 'background.paper',
//     border: '2px solid #000',
//     boxShadow: 24,
// };

// const InventoryRelatedItems = ({ item }) => {

//   const opportunityDeleteURL = `${process.env.REACT_APP_SERVER_URL}/deleteOpportunity?code=`;
//   const accountDeleteURL = `${process.env.REACT_APP_SERVER_URL}/deleteAccount?code=`;
//   const urlgetOpportunitiesbyInvid =`${process.env.REACT_APP_SERVER_URL}/getOpportunitiesbyInvid?searchId=`;
//   const urlgetAccountsbyInvid = `${process.env.REACT_APP_SERVER_URL}/getAccountbyInventory?searchId=`;

//     const navigate = useNavigate();
//     const location = useLocation();

//     const[inventoryRecordId,setInventoryRecordId]=useState()
//     const [realtedOpportunity, setRealtedOpportunity] = useState([]);
//     const [relatedAccount, setRelatedAccount] = useState([]);

//     const [opportunityModalOpen, setOpportunityModalOpen] = useState(false);
//     const [opportunityItemsPerPage, setOpportunityItemsPerPage] = useState(2);
//     const [opportunityPerPage, setOpportunityPerPage] = useState(1);
//     const [opportunityNoOfPages, setOpportunityNoOfPages] = useState(0);

//     const [accountModalOpen, setAccountModalOpen] = useState(false);
//     const [accountItemsPerPage, setAccountItemsPerPage] = useState(2);
//     const [accountPerPage, setAccountPerPage] = useState(1);
//     const [accountNoOfPages, setAccountNoOfPages] = useState(0);

    
//     const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
//     const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

//     useEffect(() => {
//         console.log('related Inventories', location.state.record.item);
      
//          setInventoryRecordId( location.state.record.item._id)
//          getOpportunitiesbyInvId(location.state.record.item._id)
//          getAccountsbyInvId(location.state.record.item._id)
//     }, [])

//     const getOpportunitiesbyInvId = (recId) => {
//         axios.post(urlgetOpportunitiesbyInvid + recId)
//             .then((res) => {
//                 console.log('response getOpportunitiesbyInvId fetch', res);
//                 if (res.data.length > 0) {
//                     setRealtedOpportunity(res.data);
//                     setOpportunityNoOfPages(Math.ceil(res.data.length / opportunityItemsPerPage));
//                     setOpportunityPerPage(1)
//                 }
//                 else {
//                   setRealtedOpportunity([]);
//                 }
//             })
//             .catch((error) => {
//                 console.log('error getTasksbyOppId fetch', error)
//             })
//     }

//     const getAccountsbyInvId = (InventoryId) => {
//       axios.post(urlgetAccountsbyInvid + InventoryId)
//         .then((res) => {
//           console.log('response getAccountsbyInvId fetch', res);
//           if (res.data.length > 0) {
//             setRelatedAccount(res.data);
//             setAccountNoOfPages(Math.ceil(res.data.length / accountItemsPerPage));
//             setAccountPerPage(1)
//           }
//           else {
//             setRelatedAccount([]);
//           }
//         })
//         .catch((error) => {
//           console.log('error task fetch', error)
//         })
//     }
  

//     const handleOpportunityCardEdit = (row) => {

//         console.log('selected record', row);
//         const item = row;
//          navigate("/opportunityDetailPage", { state: { record: { item } } })
//     };

//     const handleReqOpportunityCardDelete = (e,row) => {

//       e.stopPropagation();
//       console.log('inside handleTaskCardDelete fn')
//           setConfirmDialog({
//             isOpen:true,
//             title:`Are you sure to delete this Record ?`,
//             subTitle:"You can't undo this Operation",
//             onConfirm:()=>{onConfirmOpportunityCardDelete(row)}
//           })
//         }

//         const onConfirmOpportunityCardDelete=(row)=>{
//         console.log('req delete rec', row);
//         console.log('req delete rec id', row._id);

//         axios.post(opportunityDeleteURL + row._id)
//           .then((res) => {
//             console.log('api delete response', res);
//             setOppMenuOpen(false)
//             setNotify({
//               isOpen:true,
//               message:res.data,
//               type:'success'
//             })
//             setTimeout(()=>{
//               getOpportunitiesbyInvId(inventoryRecordId)
//             })
//           })
//           .catch((error) => {
//             console.log('api delete error', error);
//             setNotify({
//               isOpen:true,
//               message:error.message,
//               type:'error'
//             })
//           })
//           setConfirmDialog({
//             ...confirmDialog,
//             isOpen:false
//           })
//     };

//     const handleAccountCardEdit = (row) => {
//       console.log('selected record', row);
//       const item = row;
//       navigate("/accountDetailPage", { state: { record: { item } } })
//     };

    

//   const handleReqAccountCardDelete = (e,row) => {

//     e.stopPropagation();
//     console.log('inside handleTaskCardDelete fn')
//         setConfirmDialog({
//           isOpen:true,
//           title:`Are you sure to delete this Record ?`,
//           subTitle:"You can't undo this Operation",
//           onConfirm:()=>{onConfirmAccountCardDelete(row)}
//         })
//       }

//       const onConfirmAccountCardDelete=(row)=>{
//     console.log('req delete rec', row);
//     axios.post(accountDeleteURL+ row._id)
//       .then((res) => {
//         console.log('api delete response', res);
       
//         setNotify({
//           isOpen: true,
//           message: res.data,
//           type: 'success'
//       })
//       setAccountMenuOpen(false)
//       setTimeout(()=>{
//         getAccountsbyInvId(inventoryRecordId)
//       })
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


 
//   const handleChangeAccountPage = (event, value) => {
//     setAccountPerPage(value);
//   };


//   const handleChangeOpportunityPage=(event,value)=>{
//     setOpportunityPerPage(value)
//    }
//     const handleOpportunityModalOpen =()=>{
//       setOpportunityModalOpen(true);
//     }
    
//     const handleOpportunityModalClose =()=>{
//       setOpportunityModalOpen(false);
//       getOpportunitiesbyInvId(inventoryRecordId)
//       getAccountsbyInvId(inventoryRecordId)
//     }
//     const handleAccountModalOpen =()=>{
//       setAccountModalOpen(true)
//     }
//     const handleAccountModalClose =()=>{
//       setAccountModalOpen(false)
//       getOpportunitiesbyInvId(inventoryRecordId)
//       getAccountsbyInvId(inventoryRecordId)
//     }

//     // Task menu dropdown strart 
//     const [oppAnchorEl, setOppAnchorEl] = useState(null);
//     const [oppMenuSelectRec, setOppMenuSelectRec] = useState()
//     const [oppMenuOpen, setOppMenuOpen] = useState();

//     const handleOpportunityMoreMenuClick = (item, event) => {
//       setOppMenuSelectRec(item)
//       setOppAnchorEl(event.currentTarget);
//       setOppMenuOpen(true)

//     };
//     const handleOpportunityMoreMenuClose = () => {
//       setOppAnchorEl(null);
//         setOppMenuOpen(false)
//         setAccountAnchorEl(null);
//         setAccountMenuOpen(false)
//     };
//     // menu dropdown end

//     // Account menu dropdown strart //menu pass rec
//     const [accountAnchorEl, setAccountAnchorEl] = useState(null);
//     const [accountMenuSelectRec, setAccountMenuSelectRec] = useState()
//     const [accountMenuOpen, setAccountMenuOpen] = useState();

//     const handleAccountMoreMenuClick = (item, event) => {
//         console.log('handle OPP MoreMenu Click  item', item)

//         setAccountMenuSelectRec(item)
//         setAccountAnchorEl(event.currentTarget);
//         setAccountMenuOpen(true)

//     };
//     const handleAccountMoreMenuClose = () => {
//       setAccountMenuSelectRec()  
//       setAccountAnchorEl(null);
//       setAccountMenuOpen(false)
       
//     };
//     // menu dropdown end

//     return (
//         <>
//  <ToastNotification notify={notify} setNotify={setNotify} />
//  <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog}  moreModalClose={handleOpportunityMoreMenuClose}/>

//             <div style={{ textAlign: "center", marginBottom: "10px" }}>

//                 <h3> Related Items</h3>

//             </div>
//             <Accordion>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel1a-content"
//           id="panel1a-header"
//         >
//           <Typography variant="h4">Opportunity ({realtedOpportunity.length})</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Typography>
//             <div style={{ textAlign: "end", marginBottom: "5px" }}>
//               <Button variant="contained" color="info" onClick={() => handleOpportunityModalOpen()} >Add Opportunity</Button>
//             </div>
//             <Card dense compoent="span" >

//               {

//                 realtedOpportunity.length > 0 ?
//                 realtedOpportunity
//                     .slice((opportunityPerPage - 1) * opportunityItemsPerPage, opportunityPerPage * opportunityItemsPerPage)
//                     .map((item) => {
                      
//                       let   starDateConvert 
//                       if(item.closeDate){
//                         starDateConvert = new Date(item.closeDate).getUTCFullYear()
//                         + '-' +  ('0'+ (new Date(item.closeDate).getUTCMonth() + 1)).slice(-2) 
//                         + '-' + ('0'+ ( new Date(item.closeDate).getUTCDate())).slice(-2)  ||''
//                       }

//                       return (
//                         <div >

//                           <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
//                             <div
//                               key={item._id}
//                             >
//                               <Grid container spacing={2}>
//                                 <Grid item xs={12} md={10}>
//                                   <div>Name : {item.opportunityName} </div>
//                                   <div>Stage :{item.stage} </div>
//                                   <div>Close Date : {starDateConvert} </div>
//                                 </Grid>
//                                 <Grid item xs={2} md={2}>

//                                   <IconButton>
//                                     <MoreVertIcon onClick={(event) => handleOpportunityMoreMenuClick(item, event)} />
//                                     <Menu
//                                       anchorEl={oppAnchorEl}
//                                       open={oppMenuOpen}
//                                       onClose={handleOpportunityMoreMenuClose}
//                                       anchorOrigin={{
//                                         vertical: 'top',
//                                         horizontal: 'left',
//                                       }}
//                                       transformOrigin={{
//                                         vertical: 'top',
//                                         horizontal: 'left',
//                                       }}
//                                     >
//                                       <MenuItem onClick={() => handleOpportunityCardEdit(oppMenuSelectRec)}>Edit</MenuItem>
//                                       <MenuItem onClick={(e) => handleReqOpportunityCardDelete(e,oppMenuSelectRec)}>Delete</MenuItem>
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
//               realtedOpportunity.length > 0 &&
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <Pagination
//                   count={opportunityNoOfPages}
//                   page={opportunityPerPage}
//                   onChange={handleChangeOpportunityPage}
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

//       <Accordion>
//         <AccordionSummary
//           expandIcon={<ExpandMoreIcon />}
//           aria-controls="panel1a-content"
//           id="panel1a-header"
//         >
//           <Typography variant="h4">Accounts ({relatedAccount.length})</Typography>
//         </AccordionSummary>
//         <AccordionDetails>
//           <Typography>
//             <div style={{ textAlign: "end", marginBottom: "5px" }}>
//               <Button variant="contained" color="info" onClick={() => handleAccountModalOpen()} >Add Account</Button>
//             </div>
//             <Card dense compoent="span" >

//               {
//                     relatedAccount.length > 0 ?
//                     relatedAccount
//                     .slice((accountPerPage - 1) * accountItemsPerPage, accountPerPage * accountItemsPerPage)
//                     .map((item) => {
//                       return (
//                         <div >
//                           <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
//                             <div
//                               key={item._id}
//                             >
//                               <Grid container spacing={2}>
//                                 <Grid item xs={10} md={10}>
//                                   <div>Name : {item.accountName} </div>
//                                   <div>Account Number :{item.accountNumber} </div>
//                                   <div>Rating : {item.rating} </div>
//                                 </Grid>
//                                 <Grid item xs={2} md={2}>
//                                   <IconButton>
//                                     <MoreVertIcon onClick={(event) => handleAccountMoreMenuClick(item, event)} />
//                                     <Menu
//                                       anchorEl={accountAnchorEl}
//                                       open={accountMenuOpen}
//                                       onClose={handleAccountMoreMenuClose}
//                                       anchorOrigin={{
//                                         vertical: 'top',
//                                         horizontal: 'left',
//                                       }}
//                                       transformOrigin={{
//                                         vertical: 'top',
//                                         horizontal: 'left',
//                                       }}
//                                     >
//                                       <MenuItem onClick={() => handleAccountCardEdit(accountMenuSelectRec)}>Edit</MenuItem>
//                                       <MenuItem onClick={(e) => handleReqAccountCardDelete(e,accountMenuSelectRec)}>Delete</MenuItem>
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
//               relatedAccount.length > 0 &&
//               <Box display="flex" alignItems="center" justifyContent="center">
//                 <Pagination
//                   count={accountNoOfPages}
//                   page={accountPerPage}
//                   onChange={handleChangeAccountPage}
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

//       <Modal
//         open={opportunityModalOpen}
//         onClose={handleOpportunityModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         sx={{ backdropFilter: "blur(2px)" }}
//       >
//         <Box sx={ModalStyle}>
//           <ModalInventoryOpportunity handleModal={handleOpportunityModalClose} />
//         </Box>
//       </Modal>

//       <Modal
//         open={accountModalOpen}
//         onClose={handleAccountModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//         sx={{ backdropFilter: "blur(2px)" }}
//       >
//         <Box sx={ModalStyle}>
//           <ModalInventoryAccount handleModal={handleAccountModalClose} />
//         </Box>
//       </Modal>


//         </>
//     )

// }
// export default InventoryRelatedItems


