import React, { useState, useEffect } from 'react';
import {
  AppBar, Box, Toolbar, Typography, IconButton, Menu,
  Container, Avatar, Tooltip, MenuItem, Button, Popover, Dialog,
  DialogContentText, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, NavLink, useNavigate } from "react-router-dom"
import mainLogo from '../assets/user image.png';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import './AppNavbar.css'
import { RequestServer } from '../api/HttpReq';
import { GetTableNames } from './getTableNames';
import { styled, alpha } from "@mui/material/styles";

const getTableUrl = `/getObject`;

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
  ))
  (({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 8,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:active": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  }));


function AppNavbar(props) {

  console.log(props,"props navbar")

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [selected, setSelected] = useState("Inventories");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  
  const navigate = useNavigate();
  const [tableNamearr, settableNameArr] = useState( [
    {title: 'Enquiry', toNav: 'list/Enquiry'},
    {title: 'Deal', toNav: 'list/Deals'},
    {title: 'Account', toNav: 'list/Account'}, 
    {title: 'Contact', toNav: 'list/Contact'}, 
    {title: 'Inventory', toNav: 'list/Inventory'},
    {title: 'Event', toNav: 'list/Event'},
    {title: 'Dashboard', toNav: 'list/Dashboard'}, 
    {title: 'User', toNav: 'list/User'},
    {title: 'Files', toNav: 'list/File'},
    {title: 'Permissions', toNav: 'list/Permissions'}, 
    {title: 'Role', toNav: 'list/Role'}
    ]);
  const loggedInUserData = JSON.parse(sessionStorage.getItem('loggedInUser'))

  console.log(loggedInUserData, "loggedInUserData")

  useEffect(() => {
    // fetchTableNames()
  }, []);

  const fetchTableNames=()=>{
    GetTableNames()
    .then(res=>{
      console.log(res,"GetTableNames res in appbar")
      const arr=res.map(i=>{
        return {title:i,toNav:`list/${i}`}        
      })
      console.log(arr,"settableNameArr")
      settableNameArr(arr)
    })
    .catch(err=>{
      console.log(err,"GetTableNames error in appbar")
    })
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
    setDialogOpen(!dialogOpen)
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    console.log("handleCloseUserMenu")
    setAnchorElUser(null);
    // sessionStorage.removeItem('token')
    // sessionStorage.setItem('authenticated',false)
    // navigate('/')
  };

  const handleUserLogout = () => {
    console.log("handleUserLogout")
    // sessionStorage.removeItem('token')
    sessionStorage.clear();
    navigate('/')
  }

  const handleMenuItemClick = (title) => {
    setSelected(title);
    handleCloseNavMenu();
  }


  return (

    // 5C5CFF
    // fixed //static //sticky
    <AppBar position="sticky" sx={{ backgroundColor: '#5C5CFF' }} >
      <Container maxWidth="xl">
        <Toolbar disableGutters >
          <Box className="CRM-Title-Box">
            <Typography
              className="CRM-Title"
              variant="h2"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                letterSpacing: ".1rem",

                textDecoration: "none",
              }}
            >
              CLOUDDESK
            </Typography>
            <Typography
              className="CRM-Title"
              sx={{
                display: { xs: "none", md: "flex" },
                fontFamily: "Cambria",
                letterSpacing: ".1rem",
                marginLeft: "75px",
              }}
            >
              CRM
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none', } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {tableNamearr && tableNamearr.map((page, index) => (
                <MenuItem key={page.title}
                  onClick={() => handleMenuItemClick(page.title)}
                  active={selected === page.title}
                  sx={
                    selected === page.title ? { bgcolor: "#243665" } : {}
                  }
                >
                  <Link
                    to={{pathname:page.toNav, state:{date:props.data}}}
                    // state={{ data:  }}
                    style={{ textDecoration: 'none', color: 'unset' }}
                  >
                    <Typography >{page.title} </Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              fontFamily: 'sans-serif',
              textshadow: "0 0 4px silver",
            }}
          >
            Clouddesk
          </Typography>
          <Box sx={{
            flexGrow: 1, display: { xs: 'none', md: 'flex' },
            justifyContent: 'space-evenly'
            ,
          }}>
            {tableNamearr && tableNamearr.map((page, index) => (
              <MenuItem key={page.title}
                onClick={() => handleMenuItemClick(page.title)}
                active={selected === page.title}
                sx={{ borderRadius: "5px" }}
                className={selected === page.title ? 'selected-app-menuItem' : 'app-nav-css'
                }

              >
                <Link to={page.toNav}
                  style={{ textDecoration: 'none', color: 'unset' }}
                >
                  <Typography>{page.title} </Typography>
                </Link>
              </MenuItem>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={mainLogo} />
              </IconButton>
            </Tooltip>
            <Popover
              // id={id}
              open={dialogOpen}
              anchorEl={anchorElUser}
              onClose={handleOpenUserMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <div style={{ padding: '16px' }}>
                <Typography variant="subtitle1">Hi,{loggedInUserData.userFullName}</Typography>
                <Typography variant="subtitle2">{loggedInUserData.userName}</Typography>
                {/* <Typography variant="body2">{loggedInUserData.userName}</Typography> */}
                <Button variant="contained" size="small"
                  onClick={handleUserLogout}
                  endIcon={<PowerSettingsNewIcon />}
                >Logout</Button>
              </div>
            </Popover>

            {/* <Dialog open={dialogOpen} onClose={handleOpenUserMenu}>
          <DialogTitle>User Details</DialogTitle>
          <DialogContent>
            <DialogContentText>{loggedInUserData.userFullName}</DialogContentText>
            <DialogContentText>{loggedInUserData._id}</DialogContentText>
            <DialogContentText>{loggedInUserData.userName}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUserLogout}>Logout</Button>
            <Button onClick={handleOpenUserMenu}>Close</Button>
          </DialogActions>
        </Dialog> */}

            {/* <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleUserLogout}>
                  {setting}
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AppNavbar;
