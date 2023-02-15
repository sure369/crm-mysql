import React from "react";
import { Formik, useField, useFormikContext } from "formik";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TextField from '@mui/material/TextField';

const  DatePickerField =({ ...props }) =>  {

    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);

  return (
    <div >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker 
                {...field}
                {...props}
                value={(field.value && new Date(field.value)) || null}
                onChange={(val) => {
                    setFieldValue(field.name, val);
                }}
                renderInput={(params) => <TextField {...params} />}
                />
                    </LocalizationProvider>
    </div>
    
  )
}

export default DatePickerField 


// import * as React from 'react';
// import dayjs from 'dayjs';
// import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { TimePicker } from '@mui/x-date-pickers/TimePicker';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
// import { Grid,Button ,FormControl} from "@mui/material";

// export default function MaterialUIPickers() {
//   const [value, setValue] = React.useState(dayjs('2014-08-18T21:11:54'));
//     const[startDate,setStartDate] = React.useState(new Date());
//   const handleChange = (newValue) => {
//     setValue(newValue);
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//     <Grid container spacing={2}>
//             <Grid item xs={6} md={6} >
           
//         <DesktopDatePicker
//           label='Date'
//           inputFormat="MM/DD/YYYY"
//           value={value}
//           onChange={handleChange}
//           renderInput={(params) => <TextField {...params} />}
//         />
        
//       </Grid>

//         <Grid item xs={6} md={6}>
//                 <label htmlFor="closeDate">Close Date </label>
//                 <DatePicker  selected={startDate}  onChange={(date)=>setStartDate(date)} class="form-control"/>
//             </Grid>
//       </Grid>
//     </LocalizationProvider>
//   );
// }