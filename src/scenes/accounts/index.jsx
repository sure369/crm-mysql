import React, { useState, useEffect } from 'react';
import {
  Box, Button, useTheme, IconButton,
  Pagination, Tooltip, Grid, Modal, Typography
} from "@mui/material";
import {
  DataGrid, GridToolbar,
  gridPageCountSelector, gridPageSelector,
  useGridApiContext, useGridSelector
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ToastNotification from '../toast/ToastNotification';
import DeleteConfirmDialog from '../toast/DeleteConfirmDialog';
import ModalFileUpload from '../dataLoader/ModalFileUpload';
import ExcelDownload from '../Excel';
import { RequestServer } from '../api/HttpReq';
import { getPermissions } from '../Auth/getPermission';
import NoAccess from '../NoAccess/NoAccess';
import '../indexCSS/muiBoxStyles.css'
import AppNavbar from '../global/AppNavbar';
import { apiCheckPermission } from '../Auth/apiCheckPermission'
import { getLoginUserRoleDept } from '../Auth/userRoleDept';

const Accounts = ({ props }) => {

  const OBJECT_API = "Account"
  const urlDelete = `/deleteAccount?code=`;
  const urlAccount = `/accounts`;
  const urlCheckPermission = `/checkAccess`



  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const [showDelete, setShowDelete] = useState(false)
  const [selectedRecordIds, setSelectedRecordIds] = useState()
  const [selectedRecordDatas, setSelectedRecordDatas] = useState()
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [permissionValues, setPermissionValues] = useState({})

  const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
  console.log(userRoleDpt, "userRoleDpt")

  useEffect(() => {

    fetchRecords();
    fetchPermissions();
  }, []
  );

  const fetchRecords = () => {

    RequestServer(urlAccount, userRoleDpt)
      .then((res) => {
        console.log(res, "index page res")
        if (res.success) {
          setRecords(res.data)
          setFetchLoading(false)
          setFetchError(null)
        }
        else {
          setRecords([])
          setFetchError(res.error.message)
          setFetchLoading(false)
        }
      })
      .catch((err) => {
        setFetchError(err.message)
        setFetchLoading(false)
      })
  }

  const fetchPermissions = () => {
    if (userRoleDpt) {
      apiCheckPermission(userRoleDpt)
        .then(res => {
          console.log(res, "res apiCheckPermission")
          setPermissionValues(res)
        })
        .catch(err => {
          console.log(err, "res apiCheckPermission")
          setPermissionValues({})
        })
    }
  }


  const handleAddRecord = () => {
    navigate("/new-accounts", { state: { record: {} } })
  };

  const handleOnCellClick = (e) => {
    console.log('selected record', e);
    const item = e.row;
    navigate(`/accountDetailPage/${item._id}`, { state: { record: { item } } })

    // navigate(`/accountDetailPage/${row._id}`, { state: { record: { item } } })
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
    if (row.length) {
      console.log('if row', row);
      row.forEach(element => {
        onebyoneDelete(element)
      });
    }
    else {
      console.log('else', row._id);
      onebyoneDelete(row._id)
    }
  }
  const onebyoneDelete = (row) => {
    console.log('onebyoneDelete rec id', row)

    RequestServer(urlDelete + row)
      .then((res) => {
        if (res.success) {
          fetchRecords()
          setNotify({
            isOpen: true,
            message: res.data,
            type: 'success'
          })
        }
        else {
          console.log(res, "error in then")
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: 'error'
          })
        }
      })
      .catch((error) => {
        console.log('api delete error', error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: 'error'
        })
      })
      .finally(() => {
        setConfirmDialog({
          ...confirmDialog,
          isOpen: false
        })
      })
  };

  const handleImportModalOpen = () => {

    setImportModalOpen(true);
  }
  const handleImportModalClose = () => {

    setImportModalOpen(false);
  }

  const handleExportAll = () => {
    console.log("handleExportAll")
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

  const columns = [
    {
      field: "accountName", headerName: "Name",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "phone", headerName: "Phone",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "billingCity", headerName: "City",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "annualRevenue", headerName: "Annual Revenue",
      headerAlign: 'center', align: 'center', flex: 1,
      renderCell: (params) => {
        const formatCurrency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', })
        return (
          <>
            {params.row.annualRevenue ? formatCurrency.format(params.row.annualRevenue) : null}
          </>
        )
      }
    },
    {
      field: "industry", headerName: "Industry",
      headerAlign: 'center', align: 'center', flex: 1,
    },
  ]
  if (permissionValues.delete) {
    columns.push(
      {
        field: 'actions', headerName: 'Actions',
        headerAlign: 'center', align: 'center', width: 400, flex: 1,
        renderCell: (params) => {
          return (
            <>
              {
                !showDelete ?
                  <>
                    {/* <IconButton onClick={(e) => handleOnCellClick(e, params.row)} style={{ padding: '20px', color: '#0080FF' }}>
                    <EditIcon  />
                  </IconButton> */}
                    <IconButton onClick={(e) => onHandleDelete(e, params.row)} style={{ padding: '20px', color: '#FF3333' }}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                  : ''
              }
            </>
          )
        }
      })
  }


  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      {/* <AppNavbar data={{test:"aa"}}/> */}



      <Box m="20px">
        {
          permissionValues.read ?
            <>
              <Typography
                variant="h2"
                color={colors.grey[100]}
                fontWeight="bold"
                sx={{ m: "0 0 5px 0" }}
              >
                Accounts
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="h5" color={colors.greenAccent[400]}>
                  List Of Accounts
                </Typography>


                <div
                  style={{
                    display: "flex",
                    width: "250px",
                    justifyContent: "space-evenly",
                    height: '30px',
                  }}
                >

                  {showDelete ? (
                    <>
                      {
                        permissionValues.delete &&
                        <>
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

                          <Button variant="contained" color="info" onClick={handleAddRecord}>
                            New
                          </Button>

                          <ExcelDownload data={records} filename={`AccountRecords`} />
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
                  rows={records}
                  columns={columns}
                  getRowId={(row) => row._id}
                  pageSize={7}
                  rowsPerPageOptions={[7]}
                  components={{
                    // Toolbar: GridToolbar,
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
                    size > 0 ? setShowDelete(true) : setShowDelete(false)
                    console.log('checkbox selection ids', ids);
                    setSelectedRecordIds(ids)
                    const selectedIDs = new Set(ids);
                    const selectedRowRecords = records.filter((row) =>
                      selectedIDs.has(row._id.toString())
                    );
                    setSelectedRecordDatas(selectedRowRecords)
                  }}
                  onRowClick={(e) => handleOnCellClick(e)}
                />
              </Box>
            </>
            :
            null
            // <NoAccess />
        }
      </Box>

      <Modal
        open={importModalOpen}
        onClose={handleImportModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ backdropFilter: "blur(1px)" }}
      >
        <div className='modal'>
          <ModalFileUpload handleModal={handleImportModalClose} />
        </div>
      </Modal>

    </>
  )
}

export default Accounts;

