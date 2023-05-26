import api from "./api";

export const RequestServer = (endpoint,payload)=>{

        // let token = sessionStorage.getItem('token');
        // let loggedInUser =JSON.parse(sessionStorage.getItem('loggedInUser'))
        // let userRole=JSON.parse(loggedInUser.userRole).roleName;
        // let userDepartment=loggedInUser.userDepartment;
      
        // headers = headers||{};
        // headers.token = token;
        // headers.departmentName=userDepartment;
        // headers.role=userRole;
        // headers.object=obj;
        // headers['Content-Type'] = 'application/json';
        
        
        // return  axios({
        //     method : method,
        //     url: endpoint,
        //     headers : headers,
        //     payload:payload
        // })
    
        console.log(payload,"payload")
        console.log(endpoint,"endpoint")
        return  api.post(endpoint,payload)
        .then((res)=>{
            console.log('inside HttpReq res ',res)
            if(res.status ===200){
                console.log("status success ",res.data)
                return {
                    success:true,data:res.data
                }
            }
            else{
                console.log("error-status success ")
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
