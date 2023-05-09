import React, { useState,useEffect } from 'react';
import {
  AppBar, Box, Toolbar, Typography, IconButton, Menu, 
  Container, Avatar,  Tooltip, MenuItem, Button,Popover,Dialog,
  DialogContentText,DialogTitle,DialogContent,DialogActions
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, NavLink, useNavigate } from "react-router-dom"
import mainLogo from '../assets/user image.png';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import './AppNavbar.css'
import { RequestServer } from '../api/HttpReq';


const pages = [
  { title: 'Inventories', toNav: '/inventories' },
  { title: 'Enquiries', toNav: '/enquiries' },
  { title: 'Accounts', toNav: '/accounts' },
  { title: 'Contacts', toNav: '/contacts' },
  { title: 'Deals', toNav: '/deals' },
  { title: 'Event Log', toNav: '/task' },
  { title: 'Users', toNav: '/users' },
  { title: 'Roles', toNav: '/roles' },
  { title: 'File Upload', toNav: '/file' },
  {title:'Permission',toNav:'/permissions'}

  // {title:'Test',toNav:'/test'},
  // { title: 'Junction Object', toNav: '/oppInventory' },
];

const settings = ['Logout'];


const getTableUrl = `/getObject`;
function AppNavbar() {


  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [selected, setSelected] = useState("Inventories");
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();  
  const [tableNamearr, settableNameArr] = useState([]);
  const loggedInUserData= JSON.parse(sessionStorage.getItem('loggedInUser'))

  console.log(loggedInUserData,"loggedInUserData")

  useEffect(() => {
    fetchTables()
  }, []);

  const fetchTables = () => {
    RequestServer(getTableUrl)
      .then((res) => {
        if (res.success) {
          console.log(res, "res getTableUrl");
          const arr = res.data.map(i => {
            const CapLetter = i.Tables_in_crm.charAt(0).toUpperCase() + i.Tables_in_crm.slice(1);
            return { title: CapLetter, toNav: `list/${i.Tables_in_crm}` };
          });
          settableNameArr(arr);
          console.log(arr,"arr")
        } else {
          console.log("then error", res.error);
        }
      })
      .catch((err) => {
        console.log('api error', err);
      });
  };


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
          <Typography
            variant="h1"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Times New Roman',
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              textShadow:"3px 3px 3px silver"
            }}
          >
            Clouddesk
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' ,} }}>
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
              { tableNamearr && tableNamearr.map((page, index) => (
                <MenuItem key={page.title}
                  onClick={() => handleMenuItemClick(page.title)}
                  active={selected === page.title}
                  sx={
                    selected === page.title ? { bgcolor: "#243665" } : {}
                  }
                >
                  <Link to={page.toNav}
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
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              textShadow:"3px 3px 3px silver"
            }}
          >
            Clouddesk
          </Typography>
          <Box sx={{
            flexGrow: 1, display: { xs: 'none', md: 'flex' },
            justifyContent:'space-evenly'
            ,
          }}>
            {tableNamearr && tableNamearr.map((page, index) => (
              <MenuItem key={page.title}
                onClick={() => handleMenuItemClick(page.title)}
                active={selected === page.title}
                sx={{borderRadius:"5px"}}
                className={selected === page.title ? 'selected-app-menuItem' :'app-nav-css'
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
            <Button   variant="contained" size="small"
              onClick={handleUserLogout}
              endIcon={<PowerSettingsNewIcon/>}
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
