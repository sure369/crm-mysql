import React, { useEffect, useState } from 'react';
import { RequestServer } from '../api/HttpReq';

const getTableUrl = `/getObject`;

export const GetTableNames = () => {    
  const [tableNamearr, settableNameArr] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = () => {
    RequestServer(getTableUrl)
      .then((res) => {
        if (res.success) {
          console.log(res, "res getTableUrl");
          const arr = res.data.map(i => {
            const CapLetter = i.Tables_in_crm.charAt(0).toUpperCase() + i.Tables_in_crm.slice(1);
            return { title: CapLetter, toNav: `list/${i.Tables_in_crm}` };
          });
          settableNameArr(arr);
        } else {
          console.log("then error", res.error);
        }
      })
      .catch((err) => {
        console.log('api error', err);
      });
  };

  console.log(tableNamearr, "tableNamearr");
    
  return tableNamearr;
};

// import React ,{useEffect, useState} from 'react'
// import { RequestServer } from '../api/HttpReq'
// const getTableUrl=`/getObject`

// export const GetTableNames=()=> {    

//     const [tableNamearr,settableNameArr]=useState([])
// const arr=[]

//     useEffect(()=>{
//         fetchTables()
//     },[])

//     const fetchTables= ()=>{
//         RequestServer(getTableUrl)
//         .then((res)=>{
//             if(res.success){
//                 console.log(res,"res getTableUrl")
//                 res.data.map(i=>{
//                     const CapLetter = i.Tables_in_crm.charAt(0).toUpperCase() + i.Tables_in_crm.slice(1);
//                     arr.push({title:CapLetter ,toNav:`/${i.Tables_in_crm}`})
//                 })
//             }else{
//                 console.log("then error",res.error)
//             }
//         })
//         .catch((err)=>{
//             console.log('api error',err)
//         })
//         .finally(()=>{
//             settableNameArr(arr)
//         })
//     }

//     console.log(tableNamearr,"tableNamearr")
    
//   return tableNamearr ;
// }
