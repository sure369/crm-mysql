import React, { useEffect, useState } from 'react';
import { RequestServer } from '../api/HttpReq';



export const GetTableNames = () => {    
//  const getTableUrl = `/getObject`;

const getObjectTabs =`/getTabs`

const userDetails = JSON.parse(sessionStorage.getItem("loggedInUser"))
const userRoleDpt ={
                     loginUserRole:JSON.parse(userDetails.userRole).roleName,
                     loginUserDepartmentName:userDetails.userDepartment,
                   }


 return new Promise((resolve,reject)=>{
  RequestServer(getObjectTabs,userRoleDpt)
  .then(res=>{
    console.log(res,"getObjectTabs ")
    if(res.success){
      console.log(res.data,"res data getObjectTabs")
      resolve(res.data)
    }
    else{
      console.log(res.data,"error res data getObjectTabs")
      reject(res.error)
    }
  })
  .catch(err=>{
    console.log(err,"catch error getObjectTabs")
    reject(err)
  })
 })

};


// import React, { useEffect, useState } from 'react';
// import { RequestServer } from '../api/HttpReq';

// const getTableUrl = `/getObject`;

// export const GetTableNames = () => {    
//   const [tableNamearr, settableNameArr] = useState([]);

//   useEffect(() => {
//     fetchTables();
//   }, []);

//   const fetchTables = () => {
//     RequestServer(getTableUrl)
//       .then((res) => {
//         if (res.success) {
//           console.log(res, "res getTableUrl");
//           const arr = res.data.map(i => {
//             const CapLetter = i.Tables_in_crm.charAt(0).toUpperCase() + i.Tables_in_crm.slice(1);
//             return { title: CapLetter, toNav: `list/${i.Tables_in_crm}` };
//           });
//           settableNameArr(arr);
//         } else {
//           console.log("then error", res.error);
//         }
//       })
//       .catch((err) => {
//         console.log('api error', err);
//       });
//   };

//   console.log(tableNamearr, "tableNamearr");
    
//   return tableNamearr;
// };
