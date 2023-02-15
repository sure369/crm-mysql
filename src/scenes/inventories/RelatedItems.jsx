import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card, CardContent, Box, Button, Typography, Modal
    , IconButton, Grid, Accordion, AccordionSummary, AccordionDetails, Pagination, Menu, MenuItem
} from "@mui/material";
import axios from 'axios'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ModalInventoryOpportunity from "../opportunities/ModalInventoryOpp";
import Notification from '../toast/Notification';
import ModalInventoryAccount from "../accounts/ModalAccountInventory";


const ModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
};

const InventoryRelatedItems = ({ item }) => {

  const opportunityDeleteURL = `${process.env.REACT_APP_SERVER_URL}/deleteOpportunity?code=`;
  const accountDeleteURL = `${process.env.REACT_APP_SERVER_URL}/deleteAccount?code=`;
  const urlgetOpportunitiesbyInvid =`${process.env.REACT_APP_SERVER_URL}/getOpportunitiesbyInvid?searchId=`;
  const urlgetAccountsbyInvid = `${process.env.REACT_APP_SERVER_URL}/getAccountbyInventory?searchId=`;

    const navigate = useNavigate();
    const location = useLocation();

    const[inventoryRecordId,setInventoryRecordId]=useState()
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

    useEffect(() => {
        console.log('related Inventories', location.state.record.item);
      
         setInventoryRecordId( location.state.record.item._id)
         getOpportunitiesbyInvId(location.state.record.item._id)
         getAccountsbyInvId(location.state.record.item._id)
    }, [])

    const getOpportunitiesbyInvId = (recId) => {
        axios.post(urlgetOpportunitiesbyInvid + recId)
            .then((res) => {
                console.log('response getOpportunitiesbyInvId fetch', res);
                if (res.data.length > 0) {
                    setRealtedOpportunity(res.data);
                    setOpportunityNoOfPages(Math.ceil(res.data.length / opportunityItemsPerPage));
                    setOpportunityPerPage(1)
                }
                else {
                  setRealtedOpportunity([]);
                }
            })
            .catch((error) => {
                console.log('error getTasksbyOppId fetch', error)
            })
    }

    const getAccountsbyInvId = (InventoryId) => {
      axios.post(urlgetAccountsbyInvid + InventoryId)
        .then((res) => {
          console.log('response getAccountsbyInvId fetch', res);
          if (res.data.length > 0) {
            setRelatedAccount(res.data);
            setAccountNoOfPages(Math.ceil(res.data.length / accountItemsPerPage));
            setAccountPerPage(1)
          }
          else {
            setRelatedAccount([]);
          }
        })
        .catch((error) => {
          console.log('error task fetch', error)
        })
    }
  

    const handleOpportunityCardEdit = (row) => {

        console.log('selected record', row);
        const item = row;
         navigate("/opportunityDetailPage", { state: { record: { item } } })
    };

    const handleOpportunityCardDelete = (row) => {

        console.log('req delete rec', row);
        console.log('req delete rec id', row._id);

        axios.post(opportunityDeleteURL + row._id)
          .then((res) => {
            console.log('api delete response', res);
            getOpportunitiesbyInvId(inventoryRecordId)
            setOppMenuOpen(false)
            setNotify({
              isOpen:true,
              message:res.data,
              type:'success'
            })
            setTimeout(
               window.location.reload()
            )
          })
          .catch((error) => {
            console.log('api delete error', error);
            setNotify({
              isOpen:true,
              message:error.message,
              type:'error'
            })

          })
    };

    const handleAccountCardEdit = (row) => {
      console.log('selected record', row);
      const item = row;
      navigate("/accountDetailPage", { state: { record: { item } } })
    };

    

  const handleAccountCardDelete = (row) => {

    console.log('req delete rec', row);
    axios.post(accountDeleteURL+ row._id)
      .then((res) => {
        console.log('api delete response', res);
        getAccountsbyInvId(inventoryRecordId)
        setNotify({
          isOpen: true,
          message: res.data,
          type: 'success'
      })
      setAccountMenuOpen(false)
      setTimeout(
        window.location.reload()
      )
      })
      .catch((error) => {
        console.log('api delete error', error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: 'error'
      })
      })
  };


 
  const handleChangeAccountPage = (event, value) => {
    setAccountPerPage(value);
  };


  const handleChangeOpportunityPage=(event,value)=>{
    setOpportunityPerPage(value)
   }
    const handleOpportunityModalOpen =()=>{
      setOpportunityModalOpen(true);
    }
    
    const handleOpportunityModalClose =()=>{
      setOpportunityModalOpen(false);
    }
    const handleAccountModalOpen =()=>{
      setAccountModalOpen(true)
    }
    const handleAccountModalClose =()=>{
      setAccountModalOpen(false)
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
 <Notification notify={notify} setNotify={setNotify} />

            <div style={{ textAlign: "center", marginBottom: "10px" }}>

                <h3> Related Items</h3>

            </div>
            <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h4">Opportunity ({realtedOpportunity.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div style={{ textAlign: "end", marginBottom: "5px" }}>
              <Button variant="contained" color="info" onClick={() => handleOpportunityModalOpen()} >Add Opportunity</Button>
            </div>
            <Card dense compoent="span" >

              {

                realtedOpportunity.length > 0 ?
                realtedOpportunity
                    .slice((opportunityPerPage - 1) * opportunityItemsPerPage, opportunityPerPage * opportunityItemsPerPage)
                    .map((item) => {
                      
                      let   starDateConvert 
                      if(item.closeDate){
                        starDateConvert = new Date(item.closeDate).getUTCFullYear()
                        + '-' +  ('0'+ (new Date(item.closeDate).getUTCMonth() + 1)).slice(-2) 
                        + '-' + ('0'+ ( new Date(item.closeDate).getUTCDate())).slice(-2)  ||''
                      }

                      return (
                        <div >

                          <CardContent sx={{ bgcolor: "aliceblue", m: "15px" }}>
                            <div
                              key={item._id}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={10}>
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
                                    >
                                      <MenuItem onClick={() => handleOpportunityCardEdit(oppMenuSelectRec)}>Edit</MenuItem>
                                      <MenuItem onClick={() => handleOpportunityCardDelete(oppMenuSelectRec)}>Delete</MenuItem>
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
            <div style={{ textAlign: "end", marginBottom: "5px" }}>
              <Button variant="contained" color="info" onClick={() => handleAccountModalOpen()} >Add Account</Button>
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
                                      <MenuItem onClick={() => handleAccountCardEdit(accountMenuSelectRec)}>Edit</MenuItem>
                                      <MenuItem onClick={() => handleAccountCardDelete(accountMenuSelectRec)}>Delete</MenuItem>
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
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Modal
        open={opportunityModalOpen}
        onClose={handleOpportunityModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <ModalInventoryOpportunity handleModal={handleOpportunityModalClose} />
        </Box>
      </Modal>

      <Modal
        open={accountModalOpen}
        onClose={handleAccountModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle}>
          <ModalInventoryAccount handleModal={handleAccountModalClose} />
        </Box>
      </Modal>


        </>
    )

}
export default InventoryRelatedItems


