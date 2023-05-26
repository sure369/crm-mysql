import { RequestServer } from "../api/HttpReq"
export const apiCheckPermission= (obj)=>{

    const urlCheck=`/checkAccess`

  
    
    return new Promise((resolve,reject)=>{
        RequestServer(urlCheck,obj)
        .then(res=>{
            console.log(res,"res checkPermission2")
            if(res.success){
                console.log(res.data,"res.data checkPermission2")
               resolve(res.data)
            }else{
               reject (new Error(res.error.message))
            }
        })
        .catch((err)=>{
            reject(err)
        })
    })
   
}