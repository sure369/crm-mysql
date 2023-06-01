import {
    Box,
    Grid,
    Paper,
    Typography,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    SwipeableDrawer,
    Button,
    Divider, Accordion, AccordionSummary, AccordionDetails,
    TextField,
    InputAdornment,
    List,
    ListItemIcon,
    ListItem,
    ListItemText,
    ListItemButton,

} from "@mui/material";
import React, { useEffect, useState } from "react";
import { RequestServer } from "../api/HttpReq";
import axios from "axios";
import {
    Bar,
    Bubble,
    Chart,
    Doughnut,
    Line,
    Pie,
    PolarArea,
    Radar,

} from "react-chartjs-2";
import CircularProgressWithLabel from "../styles/CircularProgressWithLabel";
import "./dashboard.css";
import "../recordDetailPage/Form.css"
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CustomizedSelectForFormik from "../formik/CustomizedSelectForFormik";
import queryString from "query-string";
import ToastNotification from "../toast/ToastNotification";
import { Delete, ExpandMore } from "@mui/icons-material";

function DashboardHarish() {
    const urlOpportunity = `${process.env.REACT_APP_SERVER_URL}/opportunities`;
    const urlLead = `${process.env.REACT_APP_SERVER_URL}/leads`;
    const urlAccount = `${process.env.REACT_APP_SERVER_URL}/accounts`;
    const urlInventory = `${process.env.REACT_APP_SERVER_URL}/inventories`;
    const urlTabs = `${process.env.REACT_APP_SERVER_URL}/tabs`;
    const urlFields = `${process.env.REACT_APP_SERVER_URL}/fields`;
    const urlDashboard = `${process.env.REACT_APP_SERVER_URL}/dashboardGroup`;
    const urlPostDashboard = `${process.env.REACT_APP_SERVER_URL}/Dashboard`;
    const urlGetDashboards = `${process.env.REACT_APP_SERVER_URL}/dashboards`
    const urlDeleteDashboards = `${process.env.REACT_APP_SERVER_URL}/dashboard/`

    const user = JSON.parse(sessionStorage.getItem('loggedInUser'))
    console.log(user, "user");

    // const filterOptions = [
    //     { label: "Inventory", value: "inventory" },
    //     { label: "Lead", value: "lead" },
    //     { label: "Account", value: "account" },
    //     { label: "Opportunity", value: "opportunity" },
    // ];

    const ChartTypes = [{ chart: "Bar" }, { chart: "Pie" }, { chart: "Doughnut" }, { chart: "Line" }, { chart: "Polar" }, { chart: "Radar" }];

    const [records, setRecords] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [selectedObject, setSelectedObject] = useState([]);

    const [selectedUrl, setSelectedUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedChart, setSelectedChart] = useState("None");
    const [fields, setFields] = useState();
    const [selectedFields, setSelectedFields] = useState([]);
    const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });
    const [dashboardData, setDashboardData] = useState("");
    const [dashboardName, setDashboardName] = useState("");
    const [dashboardFiles, setDashboardFiles] = useState([]);
    const [chartData, setChartData] = useState({});



    useEffect(() => {
        // fetchRecords("None");
        fetchTabs();
        fetchDashboardData();
    }, []);

    const fetchRecords = (fetchUrl) => {
        if (fetchUrl !== "None") {

            setIsLoading(true);
            axios
                .post(fetchUrl)
                .then((res) => {
                    console.log(res, "Dashboard index page res");
                    console.log("Dashboard URL Data", res.data);
                    setRecords(res.data);
                    console.log("closedate is ", records.closeDate);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log("Dashboard URL Error is :", error);
                });
        }
    };

    const fetchTabs = () => {
        axios
            .get(urlTabs + `?department=${user.userDepartment}&role=${user.userRoleName}`)
            .then((res) => {
                console.log("fetched tabs are :", res);
                setTabs(res.data);
            })
            .catch((err) => {
                console.log("error fetching tabs ", err);
            });
    };

    const fetchFields = (x) => {
        setIsLoading(true);
        axios
            .get(urlFields + `/${x}`)
            .then((res) => {
                console.log("fetched fields are :", res.data.fieldNames);
                setFields(res.data.fieldNames);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("Error Fetching Fields", err);
            });
    };




    const handleObjectChange = (event) => {
        setSelectedObject(event.target.value);
        let x = event.target.value;
        let fetchUrl =
            x === "Account"
                ? urlAccount
                : x === "Opportunity"
                    ? urlOpportunity
                    : x === "Lead"
                        ? urlLead
                        : x === "Inventory"
                            ? urlInventory
                            : x === "None"
                                ? "None"
                                : "";
        console.log("fetch url is ", fetchUrl);
        setSelectedUrl(fetchUrl);
        setSelectedFields([])
        fetchFields(x)
        // fetchRecords(fetchUrl);

    };




    const handleChartChange = (event) => {
        console.log('selected chart is :', event.target.value);
        setSelectedChart(event.target.value);
    }

    const handleFieldChange = (event) => {
        console.log("selected field is :", event.target.value);
        let targetValue = event.target.value;
        if (targetValue.length <= 2) {
            setSelectedFields(event.target.value)
        }

        axios.get(urlDashboard + `?object=${selectedObject}&field=${event.target.value}`)
            .then((res) => {
                console.log('Dashboard Data is :', res.data);
                setDashboardData(res.data)

            })
            .catch((err) => {
                console.log('Error getting Dashboard Data :', err);
            })
    }

    console.log('dashboardData is ', dashboardData);
    const dashboardLabel = dashboardData && dashboardData.map(item => item._id)
    let keyData
    const label = dashboardLabel && dashboardLabel.map(obj => {
        console.log('obj is ', obj);
        keyData = Object.values(obj)
        return `${Object.values(obj)}`
    })
    console.log('label is ', label);
    console.log(keyData);

    console.log("dashboardLabel is", dashboardLabel);

    const dashboardDataset = dashboardData && dashboardData.map(item => item.count);


    const BarChartData = {
        labels: label,
        datasets: [
            {
                label: `${selectedObject} - ${selectedFields}`,
                backgroundColor: [
                    "#83984d",
                    "#800020",
                    "#f0b51f",
                    "#ea700b",
                    "#336b8b",
                    "#423f3f",
                ],
                borderColor: "black",
                data: dashboardDataset,
            },
        ],
    };

    const filteredTabs = tabs.filter(
        (item) =>
            item !== "Opportunity Inventory" &&
            item !== "User" &&
            item !== "Email" &&
            item !== "Role" &&
            item !== "Files" &&
            item !== "Permissions" &&
            item !== "Dashboard"
    );
    console.log("filteredTabs are :", filteredTabs);


    const handleDashboardNameChange = (event) => {

        console.log('handleDashboardNameChange is ', event.target.value);
        setDashboardName(event.target.value);
    }

    const handleChartSave = () => {
        console.log('inside handle chart save');

        const obj = { dashboardName: dashboardName, chartType: selectedChart, object: selectedObject, field: selectedFields }

        axios.post(urlPostDashboard, obj)
            .then(res => {
                console.log('res is ', res);
                console.log("New DashBoard Saved Successfully", res.data);
                if (res.status === 200) {
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: "success",
                    })
                } else {
                    console.log(res, "error in then");
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: "error",
                    })
                }

                handleChartClear();
                fetchDashboardData();
            })
            .catch(err => {
                console.log("Error Saving Dashboard", err);
                setNotify({
                    isOpen: true,
                    message: err.message,
                    type: "error",
                })
            })
    }

    const handleChartClear = () => {


        setDashboardName("");
        setSelectedChart([]);
        setSelectedObject([]);
        setSelectedFields([]);
        setFields(null);
        setDashboardData([]);


    }

    const fetchDashboardData = () => {

        axios.get(urlGetDashboards)
            .then(res => {
                console.log('fetched Dashboard data is ', res.data);
                setDashboardFiles(res.data)
            })
            .catch(err => {
                console.log('Error Fetching Dashboard data ', err);
            })
    }

    const handleChartFileDelete = (item) => {
        console.log('inside handle delete chart file');
        axios.delete(urlDeleteDashboards + `${item._id}`)
            .then(res => {
                console.log('DashBoard File Deleted Successfully', res);
                if (res.status === 200) {
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: "success",
                    })
                } else {
                    console.log(res, "error in then");
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: "error",
                    })
                }
                fetchDashboardData();
            })
            .catch(err => {
                console.log('Error deleting Dashboard File ', err);
            })
    }

    const handleChartDataClick = (item) => {
        console.log('inside handle chart data click',);
        setChartData(item);
        axios.get(urlDashboard + `?object=${item.object}&field=${item.field}`)
            .then((res) => {
                console.log('Dashboard Data is :', res.data);
                setDashboardData(res.data);
                setSelectedChart(item.chartType);
            })
            .catch((err) => {
                console.log('Error getting Dashboard Data :', err);
            })
    }





    return (
        <>
            <ToastNotification notify={notify} setNotify={setNotify} />

            <Box className="box-container">

                <Grid container spacing={2} >
                    <Grid item xs={10} lg={4} sm={8} xl={4}>

                        <Box className="filter-box" >

                            <Accordion sx={{ borderRadius: "5px", margin: "10px" }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-label="Expand"
                                    aria-controls="-content"
                                    id="-header"
                                >

                                    <Typography variant="h4" fontWeight="bold">
                                        New Dashboard
                                    </Typography>


                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box className="new-dashboard-form">
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                gap: "20px",
                                                margin: "15px",
                                            }}
                                        >
                                            <TextField
                                                value={dashboardName}
                                                label="DashBoard Name"
                                                id="outlined-start-adornment"
                                                sx={{ m: 1, width: '25ch' }}
                                                size="small"
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start"><DashboardIcon fontSize="small" /></InputAdornment>,
                                                }}
                                                onChange={(event) => handleDashboardNameChange(event)}
                                            />
                                            <FormControl sx={{ m: 1, minWidth: 120, width: "25ch" }} size="small">
                                                <InputLabel id="demo-select-small-label">
                                                    <b>Select Chart</b>
                                                </InputLabel>
                                                <Select
                                                    value={selectedChart}
                                                    label="Select Chart"
                                                    onChange={(event) => handleChartChange(event)}
                                                >
                                                    <MenuItem value="None">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {ChartTypes.sort().map((item) => (
                                                        <MenuItem value={item.chart}>{item.chart}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "flex-start",
                                                alignItems: "center",
                                                gap: "20px",
                                                margin: "15px",
                                            }}
                                        >
                                            <FormControl sx={{ m: 1, minWidth: 120, width: "25ch" }} size="small">
                                                <InputLabel id="demo-select-small-label">
                                                    <b>Select Object</b>
                                                </InputLabel>
                                                <Select
                                                    value={selectedObject}
                                                    label="Select Object"
                                                    onChange={(event) => handleObjectChange(event)}

                                                >
                                                    <MenuItem value="None">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {filteredTabs.sort().map((item) => (
                                                        <MenuItem value={item}>{item}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl sx={{ m: 1, minWidth: 120, width: "25ch" }} size="small">
                                                <InputLabel id="demo-select-small-label">
                                                    <b>Field</b>
                                                </InputLabel>
                                                <Select
                                                    value={selectedFields}
                                                    label="Field"
                                                    onChange={(event) => handleFieldChange(event)}
                                                    multiple
                                                    title={selectedFields}


                                                >
                                                    <MenuItem value="None">
                                                        <em>None</em>

                                                    </MenuItem>
                                                    {fields &&
                                                        fields.map((item) => (
                                                            <MenuItem value={item}>{item}</MenuItem>
                                                        ))}
                                                </Select>
                                                {isLoading && <CircularProgressWithLabel />}
                                            </FormControl>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px", gap: "10px" }}>
                                            <Button
                                                onClick={handleChartSave}
                                                variant="contained"
                                                color="secondary"
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                onClick={handleChartClear}
                                                variant="contained"
                                                type="reset"
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>


                            <Accordion sx={{ borderRadius: "5px", margin: "10px" }}>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                    aria-label="Expand"
                                    aria-controls="-content"
                                    id="-header"
                                >
                                    <Typography variant="h4" fontWeight="bold">
                                        Existing Dashboards
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className="new-dashboard-form">

                                        <>
                                            <List sx={{
                                                width: '100%',
                                                maxWidth: 360,
                                                bgcolor: 'background.paper',
                                                position: 'relative',
                                                overflow: 'auto',
                                                maxHeight: 250,
                                                '& ul': { padding: 0 },
                                            }}>
                                                {dashboardFiles && dashboardFiles.map((item, index) => (
                                                    <>
                                                        <ListItem sx={{ maxHeight: "200px", marginTop: "-10px" }}>
                                                            {index + 1}

                                                            <ListItemButton
                                                                onClick={() => handleChartDataClick(item)}
                                                                title={`${item.object} grouped by ${item.field}`}
                                                            >
                                                                <ListItemIcon>
                                                                    <DashboardIcon />
                                                                </ListItemIcon>

                                                                <ListItemText
                                                                    // onMouseOver={() => handleMouseOver(item)}
                                                                    // onMouseOut={handleMouseOut}
                                                                    sx={{ wordBreak: "break-all" }}
                                                                    primary={`${item.dashboardName} (${item.chartType} chart)`}
                                                                    secondary={`${item.object} grouped by ${item.field}`}
                                                                ></ListItemText>

                                                            </ListItemButton>

                                                            <Delete
                                                                sx={{ cursor: "pointer" }}
                                                                onClick={() => handleChartFileDelete(item)}
                                                            />
                                                        </ListItem>
                                                        <Divider />
                                                    </>
                                                ))}
                                            </List>

                                        </>


                                    </div>
                                </AccordionDetails>
                            </Accordion>

                        </Box>


                    </Grid>

                    <Grid item xs={10} lg={8} sm={10} xl={8}>

                        <Typography
                            variant="h3"
                            sx={{
                                textAlign: "center",
                                fontWeight: "bold",
                                textShadow: "3px 3px 4px silver",
                            }}
                        >
                            DashBoard
                        </Typography>


                        <Box display="flex" alignItems="center"></Box>
                        <br />

                        {selectedChart === "Bar" ? (
                            <Bar
                                id="null"
                                className="count-bar-chart"
                                data={BarChartData}
                            />
                        ) : selectedChart === "Pie" ? (
                            <Pie className="pie-chart" data={BarChartData} />
                        ) : selectedChart === "Doughnut" ? (
                            <Doughnut className="pie-chart" data={BarChartData} />
                        ) : selectedChart === "Line" ? (
                            <Line className="count-bar-chart" data={BarChartData} />
                        ) : selectedChart === "Polar" ? (
                            <PolarArea className="count-bar-chart" data={BarChartData} />
                        ) : selectedChart === "Radar" ? (
                            <Radar className="count-bar-chart" data={BarChartData} />
                        ) : (
                            <Bar className="count-bar-chart" data={BarChartData} />
                        )}

                    </Grid>
                </Grid>
            </Box >
        </>
    );
}

export default DashboardHarish;


