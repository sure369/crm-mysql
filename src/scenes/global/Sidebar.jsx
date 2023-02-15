import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme , Tooltip } from "@mui/material";
import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import InventoryIcon from '@mui/icons-material/Inventory';
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AssistantPhotoIcon from '@mui/icons-material/AssistantPhoto';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import DiamondIcon from '@mui/icons-material/Diamond';
import mainLogo  from '../assets/user image.png';
import AssignmentIcon from '@mui/icons-material/Assignment';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AltRouteIcon from '@mui/icons-material/AltRoute';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    // <Tooltip title={title} >
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
        title={title}
     
    >
      
      <Typography>{title}</Typography>
      <Link to={to} />
     
    </MenuItem>
    // </Tooltip>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",       
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >

      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  Clouddesk LLC
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
           
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={mainLogo}
                  // src={`../../assets/user image.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Jey
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  CEO
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Home"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/* <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography> */}
             <Item
              title="Enquiries"
              to="/enquiries"
              icon={<AssistantPhotoIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Deals"
              to="/deals"
              icon={<DiamondIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Inventories"
              to="/inventories"
              icon={<InventoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Accounts"
              to="/accounts"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
             <Item
              title="Contacts"
              to="/contacts"
              icon={<ContactPageIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Users"
              to="/users"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Tasks"
              to="/task"
              icon={<AssignmentIcon />}
              selected={selected}
              setSelected={setSelected}
          
            />
              <Item
              title="Data Loader"
              to="/dataLoder"
              icon={<NewspaperIcon/>}
              selected={selected}
              setSelected={setSelected}
          
            />
            <Item
              title="File Upload"
              to="/file"
              icon={<UploadFileIcon />}
              selected={selected}
              setSelected={setSelected}
          
            />
             <Item
              title="Junction Object"
              to="/oppInventory"
              icon={<AltRouteIcon />}
              selected={selected}
              setSelected={setSelected}
          
            />
           
            {/* <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Users"
              to="/users"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> 
            <Item
              title="User Form"
              to="/new-users"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
          </Box>
        </Menu>
      </ProSidebar>
     </Box>
  );
};

export default Sidebar;
