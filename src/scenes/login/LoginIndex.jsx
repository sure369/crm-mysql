import React ,{useEffect} from 'react'
import { Button,Grid,Paper,Avatar,TextField,Typography,
    FormControlLabel , Checkbox,Link,Box} from "@mui/material"
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FormikLogin from './FormikLogin';
import {  useNavigate } from "react-router-dom"
export default function LoginIndex() {

    const navigate = useNavigate();

    const paperStyle={padding :20,height:'100%',width:280, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                     <Avatar style={avatarStyle}><LockOpenIcon/></Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <FormikLogin/>                
                <Typography >
                     <Link href='/test1' >
                        Forgot password ?
                </Link>
                </Typography>
                <Typography > Do you have an account ?
                     <Link href="#" >
                        Sign Up 
                </Link>
                </Typography>

                 
            </Paper>
        </Grid>
    )

}
