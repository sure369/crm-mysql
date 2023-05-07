import React, { useState, useEffect } from 'react';
import {
  Box, Button, IconButton, Typography,
  Modal, useTheme, Pagination, Tooltip,
  Card, CardActionArea, CardContent, Grid, Menu, MenuItem
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import EmailModalPage from '../recordDetailPage/EmailModalPage';
import WhatAppModalPage from '../recordDetailPage/WhatsAppModalPage';
import ToastNotification from '../toast/ToastNotification';
import DeleteConfirmDialog from '../toast/DeleteConfirmDialog';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { RequestServer } from '../api/HttpReq';

const ContactsMobile = () => {

  const urlContact = `/contacts`;
  const urlDelete = `/deleteContact?code=`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const[fetchError,setFetchError]=useState()
  //email,Whatsapp
  const [showEmail, setShowEmail] = useState(false)
  const [selectedRecordIds, setSelectedRecordIds] = useState()
  const [selectedRecordDatas, setSelectedRecordDatas] = useState()
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false)

  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);

  useEffect(() => {
    fetchRecords();

  }, []);

  const fetchRecords = () => {
    RequestServer(urlContact)
    .then((res)=>{
      console.log(res,"index page res")
      if(res.success){
        setRecords(res.data)
        setFetchLoading(false)
        setFetchError(null)
        setNoOfPages(Math.ceil(res.data.length / itemsPerPage));
      }
      else{
        setRecords([])
        setFetchError(res.error.message)
        setFetchLoading(false)
      }
    })
    .catch((err)=>{
      setFetchError(err.message)
      setFetchLoading(false)
    })
    // axios.post(urlContact)
    //   .then(
    //     (res) => {
    //       console.log("res Contact records", res);
    //       if (res.data.length > 0 && (typeof (res.data) !== 'string')) {
    //         setRecords(res.data);
    //         setFetchLoading(false)
    //         setNoOfPages(Math.ceil(res.data.length / itemsPerPage));
    //       }
    //       else {
    //         setRecords([]);
    //         setFetchLoading(false)
    //       }
    //     }
    //   )
    //   .catch((error) => {
    //     console.log('error', error);
    //     setFetchLoading(false)
    //   })
  }

  const handleAddRecord = () => {
    navigate("/new-contacts", { state: { record: {} } })
  };

  const handleCardEdit = (row) => {
    console.log('selected record', row);
    const item = row;
    navigate(`/contactDetailPage/${item._id}`, { state: { record: { item } } })
  };


  const handleCardDelete = (e, row) => {
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
    if (row.length) {
      row.forEach(element => {
        onebyoneDelete(element)
      });
    }
    else {
      onebyoneDelete(row._id)
    }
  }

  const onebyoneDelete = (row) => {
    console.log('one by on delete', row)

    RequestServer(urlDelete + row)
    .then((res)=>{
      if(res.success){
        fetchRecords()
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
    // axios.post(urlDelete + row)
    //   .then((res) => {
    //     console.log('api delete response', res);
    //     setNotify({
    //       isOpen: true,
    //       message: res.data,
    //       type: 'success'
    //     })
    //     setMenuOpen(false)
    //     fetchRecords()
    //   })
    //   .catch((error) => {
    //     console.log('api delete error', error);
    //     setNotify({
    //       isOpen: true,
    //       message: error.message,
    //       type: 'error'
    //     })
    //   })
    // setConfirmDialog({
    //   ...confirmDialog,
    //   isOpen: false
    // })
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

  // menu dropdown strart //menu pass rec
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuSelectRec, setMenuSelectRec] = useState()
  const [menuOpen, setMenuOpen] = useState();

  const handleTaskMoreMenuClick = (item, event) => {
    console.log('item', item)
    console.log(event);

    setMenuSelectRec(item)
    setAnchorEl(event.currentTarget);
    setMenuOpen(true)

  };
  const handleMoreMenuClose = () => {
    setAnchorEl(null);
    setMenuOpen(false)
  };
  // menu dropdown end
  return (
    <>

      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} moreModalClose={handleMoreMenuClose} />


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
          {records.length > 0 ?
            records
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((item) => {
                return (
                  <div>
                    <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
                      <div
                        key={item._id}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={10} md={10}>
                            <div>Name : {item.fullName} </div>
                            <div>Account Name :{item.accountDetails.accountName} </div>
                            <div>Phone : {item.phone} </div>
                            <div>Email : {item.email} </div>
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
                                <MenuItem onClick={() => handleCardEdit(menuSelectRec)}>Edit</MenuItem>
                                <MenuItem onClick={(e) => handleCardDelete(e, menuSelectRec)}>Delete</MenuItem>
                              </Menu>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </div>
                    </CardContent>
                  </div>
                );
              })
            :
            <>
              <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
                <div>No Records Found</div>
              </CardContent>
            </>
          }
        </Card>
        {records.length > 0 &&
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
              sx={{ justifyContent: 'center' }}
            />
          </Box>
        }
      </Box>

      <Modal
        open={emailModalOpen}
        onClose={setEmailModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{backdropFilter:"blur(1px)"}}
      >
        <div className='modal'>
        {/* <Box sx={ModalBoxstyle}> */}
          <EmailModalPage data={selectedRecordDatas} handleModal={setEmailModalClose} bulkMail={true} />
        {/* </Box> */}
        </div>
      </Modal>

      <Modal
        open={whatsAppModalOpen}
        onClose={setWhatAppModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{backdropFilter:"blur(1px)"}}
      >
        <div className='modal'>
          <WhatAppModalPage data={selectedRecordDatas} handleModal={setWhatAppModalClose} bulkMail={true} />
        </div>
      </Modal>

    </>
  );
}

export default ContactsMobile;



// import React, { useState, useEffect } from 'react';
// import {
//   Box, Button, IconButton, Typography,
//   Modal, useTheme, Pagination, Tooltip,
//   Card, CardActionArea, CardContent, Grid, Menu, MenuItem
// } from "@mui/material";
// import { tokens } from "../../theme";
// import Header from "../../components/Header";
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";
// import EmailModalPage from '../recordDetailPage/EmailModalPage';
// import WhatAppModalPage from '../recordDetailPage/WhatsAppModalPage';
// import ToastNotification from '../toast/ToastNotification';
// import DeleteConfirmDialog from '../toast/DeleteConfirmDialog';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import EmailIcon from '@mui/icons-material/Email';
// import MoreVertIcon from '@mui/icons-material/MoreVert';

// const ContactsMobile = () => {

//   const urlContact = `/contacts`;
//   const urlDelete = `/deleteContact?code=`;

//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const navigate = useNavigate();
//   const [records, setRecords] = useState([]);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   //email,Whatsapp
//   const [showEmail, setShowEmail] = useState(false)
//   const [selectedRecordIds, setSelectedRecordIds] = useState()
//   const [selectedRecordDatas, setSelectedRecordDatas] = useState()
//   const [emailModalOpen, setEmailModalOpen] = useState(false)
//   const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false)

//   // notification
//   const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
//   //dialog
//   const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

//   const [itemsPerPage, setItemsPerPage] = useState(3);
//   const [page, setPage] = useState(1);
//   const [noOfPages, setNoOfPages] = useState(0);

//   useEffect(() => {
//     fetchRecords();

//   }, []);

//   const fetchRecords = () => {
//     axios.post(urlContact)
//       .then(
//         (res) => {
//           console.log("res Contact records", res);
//           if (res.data.length > 0 && (typeof (res.data) !== 'string')) {
//             setRecords(res.data);
//             setFetchLoading(false)
//             setNoOfPages(Math.ceil(res.data.length / itemsPerPage));
//           }
//           else {
//             setRecords([]);
//             setFetchLoading(false)
//           }
//         }
//       )
//       .catch((error) => {
//         console.log('error', error);
//         setFetchLoading(false)
//       })
//   }

//   const handleAddRecord = () => {
//     navigate("/contactDetailPage", { state: { record: {} } })
//   };

//   const handleCardEdit = (row) => {
//     console.log('selected record', row);
//     const item = row;
//     navigate("/contactDetailPage", { state: { record: { item } } })
//   };


//   const handleCardDelete = (e, row) => {
//     e.stopPropagation();
//     console.log('req delete rec', row);

//     setConfirmDialog({
//       isOpen: true,
//       title: `Are you sure to delete this Record ?`,
//       subTitle: "You can't undo this Operation",
//       onConfirm: () => { onConfirmDeleteRecord(row) }
//     })
//   }

//   const onConfirmDeleteRecord = (row) => {
//     if (row.length) {
//       row.forEach(element => {
//         onebyoneDelete(element)
//       });
//     }
//     else {
//       onebyoneDelete(row._id)
//     }
//   }

//   const onebyoneDelete = (row) => {
//     console.log('one by on delete', row)

//     axios.post(urlDelete + row)
//       .then((res) => {
//         console.log('api delete response', res);
//         setNotify({
//           isOpen: true,
//           message: res.data,
//           type: 'success'
//         })
//         setMenuOpen(false)
//         fetchRecords()
//       })
//       .catch((error) => {
//         console.log('api delete error', error);
//         setNotify({
//           isOpen: true,
//           message: error.message,
//           type: 'error'
//         })
//       })
//     setConfirmDialog({
//       ...confirmDialog,
//       isOpen: false
//     })
//   }

//   const handlesendEmail = () => {
//     console.log('inside email')
//     console.log('selectedRecordIds', selectedRecordIds);
//     setEmailModalOpen(true)
//   }

//   const setEmailModalClose = () => {
//     setEmailModalOpen(false)
//   }

//   const handlesendWhatsapp = () => {
//     console.log('inside whats app')
//     console.log('selectedRecordIds', selectedRecordIds);
//     setWhatsAppModalOpen(true)
//   }

//   const setWhatAppModalClose = () => {
//     setWhatsAppModalOpen(false)
//   }

//   const handleChangePage = (event, value) => {
//     setPage(value);
//   };

//   // menu dropdown strart //menu pass rec
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [menuSelectRec, setMenuSelectRec] = useState()
//   const [menuOpen, setMenuOpen] = useState();

//   const handleTaskMoreMenuClick = (item, event) => {
//     console.log('item', item)
//     console.log(event);

//     setMenuSelectRec(item)
//     setAnchorEl(event.currentTarget);
//     setMenuOpen(true)

//   };
//   const handleMoreMenuClose = () => {
//     setAnchorEl(null);
//     setMenuOpen(false)
//   };
//   // menu dropdown end
//   return (
//     <>

//       <ToastNotification notify={notify} setNotify={setNotify} />
//       <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} moreModalClose={handleMoreMenuClose} />


//       <Box m="20px">
//         <Header
//           title="Contacts"
//           subtitle="List of Contacts"
//         />
//         <div className='btn-test'>
//           <Button variant="contained" color="info" onClick={handleAddRecord}>
//             New
//           </Button>

//         </div>

//         <Card dense compoent="span" sx={{ bgcolor: "white" }}>
//           {records.length > 0 ?
//             records
//               .slice((page - 1) * itemsPerPage, page * itemsPerPage)
//               .map((item) => {
//                 return (
//                   <div>
//                     <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
//                       <div
//                         key={item._id}
//                       >
//                         <Grid container spacing={2}>
//                           <Grid item xs={10} md={10}>
//                             <div>Name : {item.fullName} </div>
//                             <div>Account Name :{item.accountDetails.accountName} </div>
//                             <div>Phone : {item.phone} </div>
//                             <div>Email : {item.email} </div>
//                           </Grid>
//                           <Grid item xs={2} md={2}>

//                             <IconButton>
//                               <MoreVertIcon onClick={(event) => handleTaskMoreMenuClick(item, event)} />
//                               <Menu
//                                 anchorEl={anchorEl}
//                                 open={menuOpen}
//                                 onClose={handleMoreMenuClose}
//                                 anchorOrigin={{
//                                   vertical: 'top',
//                                   horizontal: 'left',
//                                 }}
//                                 transformOrigin={{
//                                   vertical: 'top',
//                                   horizontal: 'left',
//                                 }}
//                               >
//                                 <MenuItem onClick={() => handleCardEdit(menuSelectRec)}>Edit</MenuItem>
//                                 <MenuItem onClick={(e) => handleCardDelete(e, menuSelectRec)}>Delete</MenuItem>
//                               </Menu>
//                             </IconButton>
//                           </Grid>
//                         </Grid>
//                       </div>
//                     </CardContent>
//                   </div>
//                 );
//               })
//             :
//             <>
//               <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
//                 <div>No Records Found</div>
//               </CardContent>
//             </>
//           }
//         </Card>
//         {records.length > 0 &&
//           <Box
//             sx={{
//               margin: "auto",
//               width: "fit-content",
//               alignItems: "center",
//               // justifyContent:'space-between'
//             }}>
//             <Pagination
//               count={noOfPages}
//               page={page}
//               onChange={handleChangePage}
//               defaultPage={1}
//               color="primary"
//               size="large"
//               showFirstButton
//               showLastButton
//               sx={{ justifyContent: 'center' }}
//             />
//           </Box>
//         }
//       </Box>

//       <Modal
//         open={emailModalOpen}
//         onClose={setEmailModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={ModalBoxstyle}>
//           <EmailModalPage data={selectedRecordDatas} handleModal={setEmailModalClose} bulkMail={true} />
//         </Box>
//       </Modal>

//       <Modal
//         open={whatsAppModalOpen}
//         onClose={setWhatAppModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={ModalBoxstyle}>
//           <WhatAppModalPage data={selectedRecordDatas} handleModal={setWhatAppModalClose} bulkMail={true} />
//         </Box>
//       </Modal>

//     </>
//   );
// }

// export default ContactsMobile;

// const ModalBoxstyle = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 600,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
// };

