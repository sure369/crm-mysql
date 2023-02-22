import React, { useState, useEffect } from 'react';
import {
  Box, Button, useTheme, Card, CardContent, IconButton,
  Pagination, Tooltip, Grid, MenuItem, Menu
} from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ToastNotification from '../toast/ToastNotification';
import DeleteConfirmDialog from '../toast/DeleteConfirmDialog';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const TaskMobile = () => {

  const urlDelete = `${process.env.REACT_APP_SERVER_URL}/deleteTask?code=`;
  const urlTask = `${process.env.REACT_APP_SERVER_URL}/Task`;

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  // notification
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  //dialog
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })

  const [showDelete, setShowDelete] = useState(false)
  const [selectedRecordIds, setSelectedRecordIds] = useState()
  const [selectedRecordDatas, setSelectedRecordDatas] = useState()
     
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [page, setPage] = useState(1);
  const [noOfPages, setNoOfPages] = useState(0);

  useEffect(() => {
    fetchRecords();

  }, []
  );

  const fetchRecords = () => {
    console.log('urlTask', urlTask);
    axios.post(urlTask)
      .then(
        (res) => {
          console.log("res task records", res);

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
        console.log('res task error', error);
        setFetchLoading(false)
      })
  }
  const handleAddRecord = () => {
    navigate("/taskDetailPage", { state: { record: {} } })
  };

  const handleCardEdit = ( row) => {
    console.log('selected record', row);
    const item = row;
    navigate("/taskDetailPage", { state: { record: { item } } })
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

    axios.post(urlDelete + row)
      .then((res) => {
        console.log('api delete response', res);
        setNotify({
          isOpen: true,
          message: res.data,
          type: 'success'
        })
        setMenuOpen(false)
        fetchRecords()
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

  };

  const handleChangePage = (event, value) => {
    setPage(value);
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

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />
      <DeleteConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} moreModalClose={handleMoreMenuClose} />

      <Box m="20px">
        <Header
          title="Tasks"
          subtitle="List of Task"
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
                let   starDateConvert 
                if(item.StartDate){
                   starDateConvert = new Date(item.StartDate).getUTCFullYear()
                + '-' +  ('0'+ (new Date(item.StartDate).getUTCMonth() + 1)).slice(-2) 
                + '-' + ('0'+ ( new Date(item.StartDate).getUTCDate())).slice(-2)  ||''
                }
                let related ;
                if(item.object==='Account' && item.accountDetails){
                    related = item.accountDetails.accountName
                }
                else  if(item.object==='Lead' && item.leadDetails){
                    related = item.leadDetails.leadName
                }
                else  if(item.object==='Opportunity' && item.opportunityDetails){
                    related = item.opportunityDetails.opportunityName
                }
                

                return (
                  <div>
                    <CardContent sx={{ bgcolor: "aliceblue", m: "20px" }}>
                      <div
                        key={item._id}
                      >
                         <Grid container spacing={2}>
                          <Grid item xs={10} md={10}>                     
                        <div>Subject : {item.subject} </div>
                        <div>Object :{item.object} </div>
                        <div>Related Rec: {related}</div>
                        <div>Date : {starDateConvert} </div>
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
              sx={{justifyContent:'center'}}
            />
          </Box>
}
          </Box>
    </>
  )
}
export default TaskMobile;
