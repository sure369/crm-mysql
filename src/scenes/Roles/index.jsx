import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, useTheme, Typography,Pagination ,Tooltip} from "@mui/material";
import {
  DataGrid, GridToolbar,
  gridPageCountSelector, gridPageSelector,
  useGridApiContext, useGridSelector
} from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ToastNotification from '../toast/ToastNotification';
import DeleteConfirmDialog from '../toast/DeleteConfirmDialog';
import ExcelDownload from '../Excel';
import { RequestServer } from '../api/HttpReq';

const RoleIndex = () => {

  const urlDelete = `${process.env.REACT_APP_SERVER_URL}/delete?code=`;
  const urlRoles = `${process.env.REACT_APP_SERVER_URL}/roles`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const[fetchError,setFetchError]=useState()
  const [fetchLoading, setFetchLoading] = useState(true);
  // notification
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  //dialog
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [showDelete, setShowDelete] = useState(false)
  const [selectedRecordIds, setSelectedRecordIds] = useState()
  const [selectedRecordDatas, setSelectedRecordDatas] = useState()


  useEffect(() => {
    fetchRecords();

  }, []
  );

  const fetchRecords = () => {
    RequestServer("post",urlRoles,null,{})
    .then((res)=>{
      console.log(res,"index page res")
      if(res.success){
        setRecords(res.data)
        setFetchError(null)
        setFetchLoading(false)
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
  }

  const handleAddRecord = () => {
    navigate("/new-role", { state: { record: {} } })
  };

  const handleOnCellClick = (e, row) => {
    console.log(' selected  rec', row);
    const item = row;
    navigate(`/roleDetailPage/${item._id}`, { state: { record: { item } } })
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

    RequestServer("post",urlDelete+row)
    .then((res)=>{
      if(res.success){
        fetchRecords()
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
      field: "roleName", headerName: "Role Name",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: "departmentName", headerName: "Department Name",
      headerAlign: 'center', align: 'center', flex: 1,
    },
    {
      field: 'actions', headerName: 'Actions', width: 400,
      headerAlign: 'center', align: 'center', flex: 1,
      renderCell: (params) => {
        return (
          <>
            {
              !showDelete ?
                <>
                  <IconButton onClick={(e) => handleOnCellClick(e, params.row)} style={{ padding: '20px', color: '#0080FF' }}>
                    <EditIcon  />
                  </IconButton>
                  <IconButton onClick={(e) => onHandleDelete(e, params.row)} style={{ padding: '20px', color: '#FF3333' }}>
                    <DeleteIcon  />
                  </IconButton>
                </>
                : ''
            }
          </>
        );
      }
    }
  ];

  if (records.length >= 0) {
    return (
      <>
        <ToastNotification notify={notify} setNotify={setNotify} />
        <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />

        <Box m="20px">
           <Typography
          variant="h2"
          color={colors.grey[100]}
          fontWeight="bold"
          sx={{ m: "0 0 5px 0" }}
        >
          Roles
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" color={colors.greenAccent[400]}>
            List Of Roles
          </Typography>


          <div
            style={{
              display: "flex",
              width: "250px",
              justifyContent: "space-evenly",
              height:'30px',
            }}
          >

{showDelete ? (
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
            ) : (
            <>
            <Button variant="contained" color="info" onClick={handleAddRecord}>
              New
            </Button>

                      {/* <ExcelDownload data={records} filename={`OpportunityRecords`}/> */}
                     
                
            </>
            )}
          </div>
        </Box>

          <Box
            m="15px 0 0 0"
            height="380px"
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
                borderBottom: "none",
                backgroundColor: colors.blueAccent[700],
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
              "& .C-MuiDataGrid-row-even": {
                backgroundColor: "#D7ECFF",
              },
              "& .C-MuiDataGrid-row-odd": {
                backgroundColor: "#F0F8FF",
              },
            }}
          >
             {/* <div className='btn-test'>
          {
              showDelete ? 
              <>
              <Tooltip title="Delete Selected">
                  <IconButton> <DeleteIcon sx={{ color: '#FF3333' }} onClick={(e) => onHandleDelete(e,selectedRecordIds)} /> </IconButton>
              </Tooltip>
              </>
              :
              <Button variant="contained" color="info" onClick={handleAddRecord}>
                New
              </Button>
            }
          </div> */}

            <DataGrid
              rows={records}
              columns={columns}
              getRowId={(row) => row._id}
              pageSize={7}
              rowsPerPageOptions={[7]}
              components={{
                Pagination: CustomPagination,
                // Toolbar: GridToolbar
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
            />
          </Box>
        </Box>
      </>
    )
  }
};

export default RoleIndex;



