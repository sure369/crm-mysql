import {
    Box, Grid, Typography, Accordion,
    AccordionSummary, AccordionDetails,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "../recordDetailPage/Form.css"
import ToastNotification from "../toast/ToastNotification";
import { Delete, ExpandMore } from "@mui/icons-material";
import './dashboard.css'
import DashboardDetailPage from "./dashboardDetailPage";
import DashBoardRecords from ".";
import DashboardCharts from "./dashboardCharts";

function DynamicHomePage() {

    const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });
    const [selectedDashboard, setSelectedDashboard] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formValues, setFormValues] = useState({});

    const handleRowClick = (dashboard) => {
        setFormValues(null)
        setSelectedDashboard(dashboard);
    };

    const handleFormSubmission = () => {
        setFormSubmitted(true);
    };


    const handleFormValuesChange = (newFormValues) => {
        console.log(newFormValues,"newFormValues")
        setFormValues(newFormValues);
        setSelectedDashboard(null)
    };

    return (
        <>
            <ToastNotification notify={notify} setNotify={setNotify} />
            <Box className="box-container">
                <Grid container spacing={2} >
                    <Grid item xs={10} lg={4} sm={8} xl={4}>
                        <Box className="filter-box" >
                            <Accordion sx={{ borderRadius: "5px", margin: "10px" }}>
                                <AccordionSummary expandIcon={<ExpandMore />}
                                    aria-label="Expand" aria-controls="-content" id="-header"
                                >
                                    <Typography variant="h4" fontWeight="bold">
                                        New Dashboard
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DashboardDetailPage
                                        dashboard={selectedDashboard}
                                        onFormSubmit={handleFormSubmission}
                                        onFormValuesChange={handleFormValuesChange}
                                    />
                                </AccordionDetails>
                            </Accordion>

                            <Accordion sx={{ borderRadius: "5px", margin: "10px" }}>
                                <AccordionSummary expandIcon={<ExpandMore />}
                                    aria-label="Expand" aria-controls="-content" id="-header"
                                >
                                    <Typography variant="h4" fontWeight="bold">
                                        Existing Dashboards
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <DashBoardRecords
                                        handleRowClick={handleRowClick}
                                        formSubmitted={formSubmitted}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Grid>

                    <Grid item xs={10} lg={8} sm={10} xl={8}>
                        <Typography
                            variant="h3"
                            sx={{ textAlign: "center", fontWeight: "bold", textShadow: "3px 3px 4px silver", }}
                        >
                            DashBoard
                        </Typography>
                        <Box display="flex" alignItems="center"></Box>
                        <br />
                        <DashboardCharts
                            dashboard={selectedDashboard}
                            formValues={formValues}
                        />
                    </Grid>
                </Grid>
            </Box >
        </>
    );
}

export default DynamicHomePage;

