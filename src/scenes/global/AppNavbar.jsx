import React, { useState } from 'react';
import {
  AppBar, Box, Toolbar, Typography, IconButton, Menu, 
  Container, Avatar,  Tooltip, MenuItem, Button,Popover,Dialog,
  DialogContentText,DialogTitle,DialogContent,DialogActions
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, NavLink, useNavigate } from "react-router-dom"
import mainLogo from '../assets/user image.png';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';


const pages = [
  { title: 'Inventories', toNav: '/inventories' },
  { title: 'Enquiries', toNav: '/enquiries' },
  { title: 'Accounts', toNav: '/accounts' },
  { title: 'Contacts', toNav: '/contacts' },
  { title: 'Deals', toNav: '/deals' },
  { title: 'Event Log', toNav: '/task' },
  { title: 'Users', toNav: '/users' },
  { title: 'File Upload', toNav: '/file' },

  // {title:'Test',toNav:'/test'},
  // { title: 'Junction Object', toNav: '/oppInventory' },
];

const settings = ['Logout'];

function AppNavbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [selected, setSelected] = useState("Inventories");
  const [dialogOpen, setDialogOpen] = useState(false);

  const loggedInUserData= JSON.parse(sessionStorage.getItem('loggedInUser'))

  console.log(loggedInUserData,"loggedInUserData")

  const navigate = useNavigate();

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
    sessionStorage.removeItem('token')
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
            variant="h3"
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
              {pages.map((page, index) => (
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
            }}
          >
            Clouddesk
          </Typography>
          <Box sx={{
            flexGrow: 1, display: { xs: 'none', md: 'flex' },
            justifyContent:'space-evenly'
            ,
          }}>
            {pages.map((page, index) => (
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
            {/* <Typography variant="subtitle1">Hi,{loggedInUserData.userFullName}</Typography>
            <Typography variant="subtitle2">{loggedInUserData.userName}</Typography>
           */}
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


// import  React,{useState} from 'react';
// import {AppBar,Box,Toolbar,Typography,IconButton,Menu,Container,Avatar,
//   Tooltip,MenuItem,Button} from '@mui/material';
// import MenuIcon from '@mui/icons-material/Menu';
// import { Link, NavLink } from "react-router-dom"
// import mainLogo  from '../assets/user image.png';

// const pages = [
//   { title: 'Inventories', toNav: '/inventories' },
//   { title: 'Enquiry', toNav: '/enquiries' },
//   { title: 'Accounts', toNav: '/accounts' },
//   { title: 'Contacts', toNav: '/contacts' },
//   { title: 'Deals', toNav: '/deals' },
//   { title: 'Task', toNav: '/task' },
//   { title: 'Users', toNav: '/users' },
//   { title: 'Data Loder', toNav: '/dataLoder' },
//   { title: 'File Upload', toNav: '/file' },
//   // { title: 'Junction Object', toNav: '/oppInventory' },
// ];

// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

// function AppNavbar() {
//   const [anchorElNav, setAnchorElNav] = useState(null);
//   const [anchorElUser, setAnchorElUser] = useState(null);
//   const [selected, setSelected] = useState("Users");

//   const handleOpenNavMenu = (event) => {
//     setAnchorElNav(event.currentTarget);
//   };
//   const handleOpenUserMenu = (event) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   return (
    
//     // 5C5CFF
//     // fixed //sticky //static
//     <AppBar position="sticky" sx={{backgroundColor:'#5C5CFF' }} >
//       <Container maxWidth="xl">
//         <Toolbar disableGutters >
//           {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
//           <Typography
//             variant="h3"
//              noWrap
//             component="a"
//             href="/"
//             sx={{
//               mr: 2,
//               display: { xs: 'none', md: 'flex' },
//               fontFamily: 'Times New Roman',
//               letterSpacing: '.2rem',
//               color: 'inherit',
//               textDecoration: 'none',
//             }}
//           >
//             Clouddesk
//           </Typography>

//           <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
//             <IconButton
//               size="large"
//               aria-label="account of current user"
//               aria-controls="menu-appbar"
//               aria-haspopup="true"
//               onClick={handleOpenNavMenu}
//               color="inherit"
//             >
//               <MenuIcon />
//             </IconButton>
//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorElNav}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'left',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'left',
//               }}
//               open={Boolean(anchorElNav)}
//               onClose={handleCloseNavMenu}
//               sx={{
//                 display: { xs: 'block', md: 'none' },
//                 "& .active": { color: "red", }
//               }}
//             >
//               {pages.map((page, index) => (
//                 <MenuItem key={page.title} 
//                  onClick={handleCloseNavMenu}
//                 active={selected === page.title}
                
//                 >
//                   <Link to={page.toNav}
//                     style={{ textDecoration: 'none', color: 'unset' }}
//                   >
//                       <Typography >{page.title} </Typography>
//                   </Link>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>
//           {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
//           <Typography
//             variant="h5"
//             noWrap
//             component="a"
//             href=""
//             sx={{
//               mr: 2,
//               display: { xs: 'flex', md: 'none' },
//               flexGrow: 1,
//               fontFamily: 'monospace',
//               fontWeight: 700,
//               letterSpacing: '.3rem',
//               color: 'inherit',
//               textDecoration: 'none',
//             }}
//           >
//             Clouddesk
//           </Typography>
//           <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } 
//                      , "& .active":{
//                       color: "red",
//                       }}}>
//             {pages.map((page, index) => (
//               <MenuItem key={page.title} 
             
//               >
//                 <Link to={page.toNav}
//                   style={{ textDecoration: 'none', color: 'unset' }}
//                 >
//                   <Typography>{page.title} </Typography>
//                 </Link>
//               </MenuItem>
//             ))}
//           </Box>

//           <Box sx={{ flexGrow: 0 }}>
//             <Tooltip title="Open settings">
//               <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
//                 <Avatar alt="Remy Sharp"   src={mainLogo} />
//               </IconButton>
//             </Tooltip>
//             <Menu
//               sx={{ mt: '45px' }}
//               id="menu-appbar"
//               anchorEl={anchorElUser}
//               anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               open={Boolean(anchorElUser)}
//               onClose={handleCloseUserMenu}
//             >
//               {settings.map((setting) => (
//                 <MenuItem key={setting} onClick={handleCloseUserMenu}>
//                   <Typography textAlign="center">{setting}</Typography>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }
// export default AppNavbar;

