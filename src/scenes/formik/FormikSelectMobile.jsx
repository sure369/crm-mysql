import React from "react";
import { Formik ,Form} from "formik";
import * as Yup from "yup";
import {
    Grid, Button, DialogActions,Tooltip,
    Modal, Box, Autocomplete, TextField,IconButton
} from "@mui/material";

import {AccRatingPickList,AccTypePickList} from '../../data/pickLists'


const initialValues={
    rating:''
}

const validationSchema = Yup.object({
    rating: Yup
        .mixed()
       
        .notOneOf(["null"], "Required"),

})

const  FormikSelectMobile =()=>{

    return(
  <div className="app">

    <Formik
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting,resetForm }) => {
       
        console.log('form submit values',values);
        //   setSubmitting(false);
          resetForm({ values: '' })
          
        console.log('after values',values);
        
      }}
      validationSchema={validationSchema}
      >
      {props => {
        const {
          values,
          touched,
          errors,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
          setFieldValue,setTouched,
        } = props;

        return (
            <>
             <Form>
            <div
              className={
                errors.rating && touched.rating ? "text-input error" : "text-input"
              }
            >
                 <label htmlFor="rating">Rating Name </label>
            
               {/* <Select
                name="rating" 
                selectedValue={values.rating}
                modalCloseButton={<ModalCloseButton />}
                options={AccRatingPickList}
                caretIcon={<CaretIcon />}
                onChange={newValue => {

                    if (values.rating !== newValue.value) {
                        handleChange({
                          target: {
                            value: newValue.value,
                            name: newValue.name
                          }
                        });
                    }
                   
                }}
                onBlur={newValue => {
                    setTouched({ rating: true });
                //   console.log("onBlur", newValue);
                //   handleBlur({
                //     target: {
                //       value: newValue.value,
                //       name: newValue.name
                //     }
                //   });
                }}
              /> */}
              {errors.rating && touched.rating && (
                <div style={{ color: 'red' }} >{errors.rating}</div>
              )}
            </div> 

            <button
              type="button"
              className="outline"
              onClick={handleReset}
              disabled={!dirty || isSubmitting}
            >
              Reset
            </button>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>

        {/* <Grid item xs={6} md={12} >
        <Button type='success' variant="contained" color="secondary">Save</Button>
        <Button type="reset" variant="contained" onClick={handleReset} >Cancel</Button>
        </Grid> */}
          </Form>
            </>
         
        );
      }}
    </Formik> 
  </div>
);
    }
export default FormikSelectMobile