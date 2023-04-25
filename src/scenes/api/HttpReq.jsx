import axios from "axios";

export const RequestServer = (method,endpoint,headers,payload)=>{

        let token = sessionStorage.getItem('token');

        headers = headers||{};
        headers.token = token;

        return  axios({
            method : method,
            url: endpoint,
            headers : headers,
            payload:payload

        })
        .then((res)=>{
            console.log('inside HttpReq res ',res)
            if(res.status ===200){
                return {
                    success:true,data:res.data
                }
            }
            else{
                return{
                    success:false,
                    error:{
                        status:res.status,
                        message:res.data.message
                    }
                }
            }
        }).catch((error)=>{
            console.log('inside HttpReq error',error)
            return {
                success:false,
                error:{
                    status:error.response ? error.response.status:'Error',
                    message:error.response ?error.response.data.message:'Network Error'
                }
            }
        })     
}
