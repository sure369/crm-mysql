export const getLoginUserRoleDept =(OBJECT_API)=>{


    const userDetails = JSON.parse(sessionStorage.getItem("loggedInUser"))
   const userRoleDpt ={
                        loginUserRole:JSON.parse(userDetails.userRole).roleName,
                        loginUserDepartmentName:userDetails.userDepartment,
                        object:OBJECT_API
                      }
              
    return userRoleDpt;
                      
}