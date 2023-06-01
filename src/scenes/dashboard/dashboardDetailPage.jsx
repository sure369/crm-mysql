import React, { useEffect, useState, } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, DialogActions, MenuItem } from "@mui/material";
import ToastNotification from "../toast/ToastNotification";
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import CustomizedMultiSelectForFormik from '../formik/CustomizedMultiSelectForFormik';
import '../recordDetailPage/Form.css'
import { RequestServer } from "../api/HttpReq";
import { apiMethods } from "../api/methods";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";
import { DashboardInitialValues, DashboardSavedValues } from "../formik/InitialValues/formValues";
import { DashboardChartTypePicklist } from '../../data/pickLists'
import { GetTableNames } from "../global/getTableNames";
import CustomizedTextFieldForFormik from "../formik/CustomizedTextField";

const DashboardDetailPage = ({
  dashboard,
  onFormSubmit,
  onFormValuesChange,
}) => {

  const URL_postRecords = `/upsertDashboard`;
  const URL_getObjectFields = `/getFields/`;
  const [showNew, setShowNew] = useState(true);
  const [objectNames, setObjectName] = useState([]);
  const [fieldNamesByObject, setFieldNamesByObject] = useState([]);
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
  const [permissionValues, setPermissionValues] = useState({});
  // const userRoleDpt = getLoginUserRoleDept(OBJECT_API);

  useEffect(() => {

    fetchTabsName();
    if (dashboard) {
      setShowNew(false);
      fetchFieldsName(dashboard.objectName);
    }
  }, [dashboard]);

  const fetchTabsName = async () => {
    console.log("inside fetchTabsName")
    await GetTableNames()
      .then((res) => {
        console.log(res, "inside GetTableNames")
        const arr = res.map((i) => {
          return { text: i, value: i };
        });
        setObjectName(arr);
      })
      .catch((err) => {
        console.log(err, 'GetTableNames error in appbar');
        setObjectName([]);
      });
  };

  const initialValues = DashboardInitialValues(dashboard);
  const savedValues = DashboardSavedValues(dashboard);

  console.log(initialValues, "initialValues")
  console.log(savedValues, "savedValues")
  console.log(dashboard, "dashboard")

  const validationSchema = Yup.object({
    dashboardName: Yup.string().required('Required'),
    chartType: Yup.string().required('Required'),
    objectName: Yup.string().required('Required'),
    fields: Yup.array()
      .min(1, 'Select at least one field')
      .max(2, 'You can select a maximum of two fields'),
  });

  const formSubmission = async (values, { resetForm }) => {
    let dateSeconds = new Date().getTime();
    let createDateSec = new Date(values.createdDate).getTime();
    values.fields = JSON.stringify(values.fields)
    if (showNew) {
      values.modifiedDate = dateSeconds;
      values.createdDate = dateSeconds;
      values.createdBy = (sessionStorage.getItem('loggedInUser'));
      values.modifiedBy = (sessionStorage.getItem('loggedInUser'));

    } else if (!showNew) {
      values.modifiedDate = dateSeconds;
      values.createdDate = createDateSec;
      values.createdBy = (sessionStorage.getItem('loggedInUser'));
      values.modifiedBy = (sessionStorage.getItem('loggedInUser'));
    }
    console.log('after change form submission value', values);

    await RequestServer(URL_postRecords, values)
      .then((res) => {
        console.log(res, "dashboard upsert res")
        if (res.success) {
          setNotify({
            isOpen: true,
            message: res.data,
            type: 'success',
          });
        } else {
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: 'error',
          });
        }
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: error.message,
          type: 'error',
        });
      })
      .finally(() => {
        setTimeout(() => {
          resetForm();
          onFormSubmit();
        }, 2000);
      });
  };

  const fetchFieldsName = (objectName) => {
    RequestServer(URL_getObjectFields + objectName)
      .then((res) => {
        console.log(res, "fetchFieldsName res")
        if (res.success) {
          const arr = res.data.map((i) => {
            return { text: i, value: i };
          });
          console.log(arr, "fetchFieldsName  arr")
          setFieldNamesByObject(arr);
        } else {
          setFieldNamesByObject([]);
        }
      })
      .catch((err) => {
        setFieldNamesByObject([]);
      });
  };

  const handleFormChange = (event, values) => {

    if (showNew) {
      const { name, value } = event.target;
      const updatedFormValues = {
        ...values,
        [name]: value,
      };
      if (
        updatedFormValues.chartType !== '' &&
        updatedFormValues.objectName !== '' &&
        updatedFormValues.fields.length > 0
      ) {
        // Preserve the existing form values for unchanged fields
        const finalFormValues = {
          ...updatedFormValues,
        };
        console.log(finalFormValues, "new handleFormChange")
        // Pass the updated form values to the onFormValuesChange function
        onFormValuesChange(finalFormValues);
      }
    } else {
      const { name, value } = event.target;
      const updatedFormValues = {
        ...dashboard,
        [name]: value,
      };

      if (
        updatedFormValues.chartType !== '' &&
        updatedFormValues.objectName !== '' &&
        updatedFormValues.fields.length > 0
      ) {
        // Preserve the existing form values for unchanged fields
        const finalFormValues = {
          ...updatedFormValues,
        };
        console.log(finalFormValues, "old handleFormChange")
        //   initialValues(finalFormValues)
        // Pass the updated form values to the onFormValuesChange function
        onFormValuesChange(finalFormValues);
      }
    }

  };



  const handleClosePage = () => {
    // setshowNew(true)
  }

  return (
    <Grid item xs={12} style={{ margin: '20px' }}>
      <Formik
        enableReinitialize={true}
        initialValues={showNew ? initialValues : savedValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
      >
        {(props) => {
          const {
            values,
            dirty,
            isSubmitting,
            isValid,
            handleChange,
            handleSubmit,
            handleReset,
            setFieldValue,
            errors,
            touched,
          } = props;

          return (
            <>
              <ToastNotification notify={notify} setNotify={setNotify} />
              <Form className="new-dashboard-form">
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <label htmlFor="dashboardName">
                      Dashboard Name <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="dashboardName"
                      component={CustomizedTextFieldForFormik}
                      onChange={(event) => {
                        setFieldValue('dashboardName', event.target.value);
                        handleFormChange(event, values);
                      }}
                    />
                    <div style={{ color: 'red' }}>
                      <ErrorMessage name="dashboardName" />
                    </div>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <label htmlFor="chartType">
                      Chart Type <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="chartType"
                      component={CustomizedSelectForFormik}
                      onChange={(event) => {
                        setFieldValue('chartType', event.target.value);
                        handleFormChange(event, values);
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {DashboardChartTypePicklist.map((i) => {
                        return (
                          <MenuItem value={i.value} key={i.value}>
                            {i.text}
                          </MenuItem>
                        );
                      })}
                    </Field>
                    <div style={{ color: 'red' }}>
                      <ErrorMessage name="chartType" />
                    </div>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <label htmlFor="objectName">
                      Object Name <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="objectName"
                      component={CustomizedSelectForFormik}
                      onChange={(e) => {
                        fetchFieldsName(e.target.value);
                        setFieldValue('objectName', e.target.value);
                        setFieldValue('fields', [])
                        handleFormChange(e, values);
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {objectNames.map((i) => {
                        return (
                          <MenuItem value={i.value} key={i.value}>
                            {i.text}
                          </MenuItem>
                        );
                      })}
                    </Field>
                    <div style={{ color: 'red' }}>
                      <ErrorMessage name="objectName" />
                    </div>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <label htmlFor="fields">
                      Fields <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="fields"
                      component={CustomizedMultiSelectForFormik}
                      onChange={(event) => {
                        setFieldValue('fields', event.target.value);
                        handleFormChange(event, values);
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {fieldNamesByObject.map((i) => {
                        return (
                          <MenuItem value={i.value} key={i.value}>
                            {i.text}
                          </MenuItem>
                        );
                      })}
                    </Field>
                    <div style={{ color: 'red' }}>
                      <ErrorMessage name="fields" />
                    </div>
                  </Grid>
                </Grid>
                <div className="action-buttons">
                  <DialogActions sx={{ justifyContent: 'space-between' }}>
                    {showNew ? (
                      <Button
                        type="success"
                        variant="contained"
                        color="secondary"
                        disabled={isSubmitting || !dirty || !isValid}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        type="success"
                        variant="contained"
                        color="secondary"
                        disabled={isSubmitting || !dirty}
                      >
                        Update
                      </Button>
                    )}
                    <Button type="reset" variant="contained" onClick={handleClosePage}>
                      Cancel
                    </Button>
                  </DialogActions>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
    </Grid>
  );
};

export default DashboardDetailPage;
