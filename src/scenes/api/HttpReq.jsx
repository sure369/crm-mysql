import axios from "axios";

export const RequestServer = (method,endpoint,headers,payload)=>{

        let token = sessionStorage.getItem('token');

        console.log(method,"method")
        console.log(endpoint,"endpoint")
        console.log(headers,"headers")
        console.log(payload,"payload")

        headers = headers||{};
        headers.token = token;
        headers['Content-Type'] = 'application/json';
        
        return  axios({
            method : method,
            url: endpoint,
            headers : headers,
            body:payload

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
