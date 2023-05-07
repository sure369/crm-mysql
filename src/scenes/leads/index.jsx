import React, { useState, useEffect } from "react";
import {  useTheme, Box, Button,IconButton, Pagination,
          Tooltip,Grid, Modal,Typography,
          MenuItem, FormControl, InputLabel, Select,
} from "@mui/material";
import { DataGrid,GridToolbar,gridPageCountSelector, gridPageSelector, 
        useGridApiContext,useGridSelector,} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ToastNotification from "../toast/ToastNotification";
import DeleteConfirmDialog from "../toast/DeleteConfirmDialog";
import ModalFileUpload from "../dataLoader/ModalFileUpload";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import EmailModalPage from "../recordDetailPage/EmailModalPage";
import WhatAppModalPage from "../recordDetailPage/WhatsAppModalPage";
import ExcelDownload from "../Excel";
import { RequestServer } from "../api/HttpReq";
import "../recordDetailPage/Form.css";
import { LeadMonthPicklist } from "../../data/pickLists";
import { getPermissions } from "../Auth/getPermission";
import NoAccess from "../NoAccess/NoAccess";
import '../indexCSS/muiBoxStyles.css'

const Leads = () => {
  const urlLead = `/leads`;
  const urlSearchLead = `/leads?`;
  const urlDelete = `/deleteLead?code=`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [filteredRecord, setFilteredRecord] = useState([]);
  const [fetchError, setFetchError] = useState();
  const [fetchLoading, setFetchLoading] = useState(true);
  // notification
  const [notify, setNotify] = useState({isOpen: false, message: "",type: "",});
  //dialog
  const [confirmDialog, setConfirmDialog] = useState({isOpen: false, title: "",subTitle: "",});

  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecordIds, setSelectedRecordIds] = useState();
  const [selectedRecordDatas, setSelectedRecordDatas] = useState();

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [filterMonth, setFilterMonth] = useState();
  const [permissionValues,setPermissionValues]=useState({})

  useEffect(() => {
    fetchRecords();    
    const getPermission=getPermissions("Lead")
    setPermissionValues(getPermission)
  }, []);

  const fetchRecords = () => {
    RequestServer(urlLead)
      .then((res) => {
        console.log(res, "index page res");
        if (res.success) {
          setRecords(res.data);
          setFilteredRecord(res.data);
          setFetchLoading(false);
          setFetchError(null);
        } else {
          setRecords([]);
          setFetchError(res.error.message);
          setFetchLoading(false);
        }
      })
      .catch((err) => {
        setFetchError(err.message);
        setFetchLoading(false);
      });
  };
  const handleAddRecord = () => {
    navigate("/new-leads", { state: { record: {} } });
  };

  const handleOnCellClick = (e) => {
    console.log("selected record", e);
    const item = e.row;
    navigate(`/leadDetailPage/${item._id}`, { state: { record: { item } } });
  };

  const onHandleDelete = (e, row) => {
    e.stopPropagation();
    console.log("req delete rec", row);
    setConfirmDialog({
      isOpen: true,
      title: `Are you sure to delete this Record ?`,
      subTitle: "You can't undo this Operation",
      onConfirm: () => {
        onConfirmDeleteRecord(row);
      },
    });
  };

  const onConfirmDeleteRecord = (row) => {
    if (row.length) {
      console.log("if row", row);
      row.forEach((element) => {
        onebyoneDelete(element);
      });
    } else {
      console.log("else", row._id);
      onebyoneDelete(row._id);
    }
  };

  const onebyoneDelete = (row) => {
    console.log("onebyoneDelete rec id", row);
    RequestServer(urlDelete + row)
      .then((res) => {
        if (res.success) {
          fetchRecords();
          setNotify({
            isOpen: true,
            message: res.data,
            type: "success",
          });
        } else {
          console.log(res, "error in then");
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: "error",
          });
        }
      })
      .catch((error) => {
        console.log("api delete error", error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: "error",
        });
      })
      .finally(() => {
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false,
        });
      });
  };

  const handleImportModalOpen = () => {
    setImportModalOpen(true);
  };
  const handleImportModalClose = () => {
    setImportModalOpen(false);
  };
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
    console.log("inside email");
    console.log("selectedRecordIds", selectedRecordIds);
    setEmailModalOpen(true);
  };

  const setEmailModalClose = () => {
    setEmailModalOpen(false);
  };

  const handlesendWhatsapp = () => {
    console.log("inside whats app");
    console.log("selectedRecordIds", selectedRecordIds);
    setWhatsAppModalOpen(true);
  };

  const setWhatAppModalClose = () => {
    setWhatsAppModalOpen(false);
  };

  const handleLeadFilterChange = (e) => {
    const value = e.target.value;
    const label = e.target.name;
    console.log(`${urlSearchLead}${label}=${value}`);
    if (e.target.value === null) {
      fetchRecords();
    } else {
      RequestServer(`${urlSearchLead}${label}=${value}`)
        .then((res) => {
          console.log("Searched Month ", res);
          if (res.success) {
            setFilteredRecord(res.data);
          }
        })
        .catch((err) => {
          console.log("Search Error is ", err);
        });
    }
  };
  const columns = [
    {
      field: "fullName",
      headerName: "Full Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "leadSource",
      headerName: "Lead Source",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "industry",
      headerName: "Industry",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "leadStatus",
      headerName: "Lead Status",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      flex: 1,
    }]
    if (permissionValues.delete) {
      columns.push(
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      width: 400,
      flex: 1,
      renderCell: (params) => {
        return (
          <>
            {!showDelete ? (
              <>
                {/* <IconButton  onClick={(e) => handleOnCellClick(e, params.row)} style={{ padding: '20px', color: '#0080FF' }}>
                    <EditIcon />
                  </IconButton> */}
                <IconButton
                  onClick={(e) => onHandleDelete(e, params.row)}
                  style={{ padding: "20px", color: "#FF3333" }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ) : (
              ""
            )}
          </>)}})
    }

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />

      <Box m="20px">
        {
          permissionValues.read ? <>
        
        <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: "0 0 5px 0" }}
        >
          Enquiries
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" color={colors.greenAccent[400]}>
            List Of Enquiries
          </Typography>

          <div
            style={{
              display: "flex",
              width: "380px",
              justifyContent: "space-evenly",
              height: "30px",
            }}
          >
            {showDelete ? (
              <>
              {
                permissionValues.delete &&
                <>
                <Tooltip title="Email">
                  <IconButton>
                    <EmailIcon
                      sx={{ color: "#DB4437" }}
                      onClick={handlesendEmail}
                    />{" "}
                  </IconButton>
                </Tooltip>
                {/* <Tooltip title="Whatsapp">
                    <IconButton> <WhatsAppIcon sx={{ color: '#34A853' }} onClick={handlesendWhatsapp} /> </IconButton>
                  </Tooltip> */}
                <Tooltip title="Delete Selected">
                  <IconButton>
                    <DeleteIcon
                      sx={{ color: "#FF3333" }}
                      onClick={(e) => onHandleDelete(e, selectedRecordIds)}
                    />
                  </IconButton>
                </Tooltip>
                </>
              }
              </>
            ) : (
              <>
              {
                permissionValues.read &&
              <>
                <FormControl sx={{ mr: 1, bottom: "15px" }}>
                  <InputLabel id="demo-simple-select-label">
                    <b> Select Lead Month </b>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filterMonth}
                    label="Select Lead Month"
                    name="month"
                    style={{ width: 155 }}
                    SelectDisplayProps={{
                      style: { paddingTop: "12px" },
                    }}
                    onChange={handleLeadFilterChange}
                  >
                    <MenuItem value={null}>
                      <em>None</em>
                    </MenuItem>
                    {LeadMonthPicklist.map((i) => {
                      return <MenuItem value={i.value}>{i.text}</MenuItem>;
                    })}
                  </Select>
                </FormControl>
                </>
                }
                {
                  permissionValues.create &&
                <>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleImportModalOpen}
                  sx={{ color: "white" }}
                >
                  Import
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleAddRecord}
                >
                  New
                </Button>

                <ExcelDownload data={records} filename={`LeadRecords`} />
              </>
              }
              </>
            )}
          </div>
        </Box>
        <Box
          m="15px 0 0 0"
          height="380px"
          className="my-mui-styles"
        >
          <DataGrid
            rows={filteredRecord}
            columns={columns}
            getRowId={(row) => row._id}
            pageSize={7}
            rowsPerPageOptions={[7]}
            // onCellClick={handleOnCellClick}
            components={{
              Pagination: CustomPagination,
              // Toolbar: GridToolbar
            }}
            loading={fetchLoading}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0
                ? "C-MuiDataGrid-row-even"
                : "C-MuiDataGrid-row-odd"
            }
            checkboxSelection
            disableSelectionOnClick
            onSelectionModelChange={(ids) => {
              var size = Object.keys(ids).length;
              size > 0 ? setShowDelete(true) : setShowDelete(false);
              console.log("checkbox selection ids", ids);
              setSelectedRecordIds(ids);
              const selectedIDs = new Set(ids);
              const selectedRowRecords = records.filter((row) =>
                selectedIDs.has(row._id.toString())
              );
              setSelectedRecordDatas(selectedRowRecords);
            }}
            onRowClick={(e) => handleOnCellClick(e)}
          />
        </Box>
        </>
        : <NoAccess/>
        }
      </Box>

      <Modal
        open={importModalOpen}
        onClose={handleImportModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <ModalFileUpload handleModal={handleImportModalClose} />
        </div>
      </Modal>

      <Modal
        open={emailModalOpen}
        onClose={setEmailModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <EmailModalPage
            data={selectedRecordDatas}
            handleModal={setEmailModalClose}
            bulkMail={true}
          />
        </div>
      </Modal>

      <Modal
        open={whatsAppModalOpen}
        onClose={setWhatAppModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modal">
          <WhatAppModalPage
            data={selectedRecordDatas}
            handleModal={setWhatAppModalClose}
            bulkMail={true}
          />
        </div>
      </Modal>
    </>
  );
};

export default Leads;


// import React, { useState, useEffect } from 'react';
// import {  useTheme, Box, Button, IconButton,
//    Pagination, Tooltip, Grid, Modal
// } from "@mui/material";
// import {  DataGrid, GridToolbar,  gridPageCountSelector,
//    gridPageSelector,useGridApiContext, useGridSelector
// } from "@mui/x-data-grid";
// import { tokens } from "../../theme";
// import Header from "../../components/Header";
// import axios from 'axios'
// import { useNavigate } from "react-router-dom";
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import ToastNotification from '../toast/ToastNotification';
// import DeleteConfirmDialog from '../toast/DeleteConfirmDialog';
// import ModalFileUpload from '../dataLoader/ModalFileUpload';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import EmailIcon from '@mui/icons-material/Email';
// import EmailModalPage from '../recordDetailPage/EmailModalPage';
// import WhatAppModalPage from '../recordDetailPage/WhatsAppModalPage';

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


// const Leads = () => {

//   const urlLead = `${process.env.REACT_APP_SERVER_URL}/leads`;
//   const urlDelete = `${process.env.REACT_APP_SERVER_URL}/deleteLead?code=`;

//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const navigate = useNavigate();
//   const [records, setRecords] = useState([]);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   // notification
//   const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
//   //dialog
//   const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

//   const [showDelete, setShowDelete] = useState(false)
//   const [selectedRecordIds, setSelectedRecordIds] = useState()
//   const [selectedRecordDatas, setSelectedRecordDatas] = useState()

//   const [emailModalOpen, setEmailModalOpen] = useState(false)
//   const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false)
//   const [importModalOpen, setImportModalOpen] = useState(false)


//   useEffect(() => {
//     fetchRecords();

//   }, []);

//   const fetchRecords = () => {
//     axios.post(urlLead)
//       .then(
//         (res) => {
//           console.log("res Lead records", res);
//           if (res.data.length > 0 && (typeof (res.data) !== 'string')) {
//             setRecords(res.data);
//             setFetchLoading(false)
//           }
//           else {
//             setRecords([]);
//             setFetchLoading(false)
//           }
//         }
//       )
//       .catch((error) => {
//         console.log('res Lead error', error);
//         setFetchLoading(false)
//       })
//   }
//   const handleAddRecord = () => {
//     navigate("/new-leads", { state: { record: {} } })
//   };

//   const handleOnCellClick = (e, row) => {
//     console.log('selected record', row);
//     const item = row;
//     navigate("/leadDetailPage", { state: { record: { item } } })
//   };

//   const onHandleDelete = (e, row) => {
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
//       console.log('if row', row);
//       row.forEach(element => {
//         onebyoneDelete(element)
//       });
//     }
//     else {
//       console.log('else', row._id);
//       onebyoneDelete(row._id)
//     }
//   }

//   const onebyoneDelete = (row) => {
//     console.log('onebyoneDelete rec id', row)
//     axios.post(urlDelete + row)
//       .then((res) => {
//         console.log('api delete response', res);
//         fetchRecords();
//         setNotify({
//           isOpen: true,
//           message: res.data,
//           type: 'success'
//         })
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
//   };

//   const handleImportModalOpen = () => {

//     setImportModalOpen(true);
//   }
//   const handleImportModalClose = () => {

//     setImportModalOpen(false);
//   }
//   function CustomPagination() {
//     const apiRef = useGridApiContext();
//     const page = useGridSelector(apiRef, gridPageSelector);
//     const pageCount = useGridSelector(apiRef, gridPageCountSelector);

//     return (
//       <Pagination
//         color="primary"
//         count={pageCount}
//         page={page + 1}
//         onChange={(event, value) => apiRef.current.setPage(value - 1)}
//       />
//     );
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



//   const columns = [
//     {
//       field: "fullName", headerName: "Full Name",
//       headerAlign: 'center', align: 'center', flex: 1,
//     },
//     {
//       field: "leadSource", headerName: "Lead Source",
//       headerAlign: 'center', align: 'center', flex: 1,
//     },
//     {
//       field: "industry", headerName: "Industry",
//       headerAlign: 'center', align: 'center', flex: 1,
//     },
//     {
//       field: "leadStatus", headerName: "Lead Status",
//       headerAlign: 'center', align: 'center', flex: 1,
//     },
//     {
//       field: "email", headerName: "Email",
//       headerAlign: 'center', align: 'center', flex: 1,
//     },
//     {
//       field: 'actions', headerName: 'Actions',
//       headerAlign: 'center', align: 'center', width: 400, flex: 1,
//       renderCell: (params) => {
//         return (
//           <>
//             {
//               !showDelete ?
//                 <>
//                   <IconButton style={{ padding: '20px', color: '#0080FF' }}>
//                     <EditIcon onClick={(e) => handleOnCellClick(e, params.row)} />
//                   </IconButton>
//                   <IconButton style={{ padding: '20px', color: '#FF3333' }}>
//                     <DeleteIcon onClick={(e) => onHandleDelete(e, params.row)} />
//                   </IconButton>
//                 </>
//                 : ''
//             }
//           </>
//         );
//       }
//     }
//   ];

//   return (
//     <>
//       <ToastNotification notify={notify} setNotify={setNotify} />
//       <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />

//       <Box m="20px">
//         <Header
//           title="Enquiry"
//           subtitle="List of Enquiries"
//         />
//         <Box
//           m="40px 0 0 0"
//           height="75vh"
//           sx={{
//             "& .MuiDataGrid-root": {
//               border: "none",
//             },
//             "& .MuiDataGrid-cell": {
//               borderBottom: "none",
//             },
//             "& .name-column--cell": {
//               color: colors.greenAccent[300],
//             },
//             "& .MuiDataGrid-columnHeaders": {
//               backgroundColor: colors.blueAccent[700],
//               borderBottom: "none",
//             },
//             "& .MuiDataGrid-columnHeaderTitle": {
//               fontWeight: 'bold !important',
//               overflow: 'visible !important'
//             },
//             "& .MuiDataGrid-virtualScroller": {
//               // backgroundColor: colors.primary[400],
//             },
//             "& .MuiDataGrid-footerContainer": {
//               borderBottom: "none",
//               backgroundColor: colors.blueAccent[700],
//             },
//             "& .MuiCheckbox-root": {
//               color: `${colors.greenAccent[200]} !important`,
//             },
//             "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//               color: `${colors.grey[100]} !important`,
//             },
//             "& .MuiDataGrid-row:hover": {
//               backgroundColor: "#CECEF0"
//             },
//             "& .C-MuiDataGrid-row-even": {
//               backgroundColor: "#D7ECFF",
//             },
//             "& .C-MuiDataGrid-row-odd": {
//               backgroundColor: "#F0F8FF",
//             },
//           }}
//         >

//           <div className='btn-test'>
//             {
//               showDelete ?
//                 <>
//                   <Tooltip title="Email">
//                     <IconButton> <EmailIcon sx={{ color: '#DB4437' }} onClick={handlesendEmail} /> </IconButton>
//                   </Tooltip>
//                   <Tooltip title="Whatsapp">
//                     <IconButton> <WhatsAppIcon sx={{ color: '#34A853' }} onClick={handlesendWhatsapp} /> </IconButton>
//                   </Tooltip>
//                   <Tooltip title="Delete Selected">
//                     <IconButton> <DeleteIcon sx={{ color: '#FF3333' }} onClick={(e) => onHandleDelete(e, selectedRecordIds)} /> </IconButton>
//                   </Tooltip>
//                 </>
//                 :
//                 <Box display="flex" justifyContent="space-between">
//                   <Grid container spacing={2}>
//                     <Grid item xs={6}>
//                       <Button
//                         variant="contained" color="secondary" onClick={handleImportModalOpen}
//                         sx={{ color: 'white' }}
//                       >
//                         Import
//                       </Button>
//                     </Grid>
//                     <Grid item xs={6}>
//                       <Button variant="contained" color="info" onClick={handleAddRecord}>
//                         New
//                       </Button>
//                     </Grid>
//                   </Grid>
//                 </Box>
//             }
//           </div>

//           <DataGrid
//             rows={records}
//             columns={columns}
//             getRowId={(row) => row._id}
//             pageSize={7}
//             rowsPerPageOptions={[7]}
//             // onCellClick={handleOnCellClick}
//             components={{
//               Pagination: CustomPagination,
//               Toolbar: GridToolbar
//             }}
//             loading={fetchLoading}
//             getRowClassName={(params) =>
//               params.indexRelativeToCurrentPage % 2 === 0 ? 'C-MuiDataGrid-row-even' : 'C-MuiDataGrid-row-odd'
//             }
//             checkboxSelection
//             disableSelectionOnClick
//             onSelectionModelChange={(ids) => {
//               var size = Object.keys(ids).length;
//               size > 0 ? setShowDelete(true) : setShowDelete(false)
//               console.log('checkbox selection ids', ids);
//               setSelectedRecordIds(ids)
//               const selectedIDs = new Set(ids);
//               const selectedRowRecords = records.filter((row) =>
//                 selectedIDs.has(row._id.toString())
//               );
//               setSelectedRecordDatas(selectedRowRecords)

//             }}
//           />
//         </Box>
//       </Box>

//       <Modal
//         open={importModalOpen}
//         onClose={handleImportModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={ModalStyle}>
//           <ModalFileUpload handleModal={handleImportModalClose} />
//         </Box>
//       </Modal>

//       <Modal
//         open={emailModalOpen}
//         onClose={setEmailModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={ModalStyle}>
//           <EmailModalPage data={selectedRecordDatas} handleModal={setEmailModalClose} bulkMail={true} />
//         </Box>
//       </Modal>

//       <Modal
//         open={whatsAppModalOpen}
//         onClose={setWhatAppModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={ModalStyle}>
//           <WhatAppModalPage data={selectedRecordDatas} handleModal={setWhatAppModalClose} bulkMail={true} />
//         </Box>
//       </Modal>

//     </>
//   );
// };

// export default Leads;
