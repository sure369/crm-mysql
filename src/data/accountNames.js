import React, { useEffect, useState } from 'react'
import axios from 'axios'
const fetchAccountsUrl =`${process.env.REACT_APP_SERVER_URL}/accountsname`;

function AccountNames() {

    const [name,setName]= useState([])

    useEffect(()=>{

    })

    const fetchAccountsName=()=>{
        axios.post(fetchAccountsUrl)
        .then((res)=>{
            console.log('res fetchAccountsUrl',res.data)
            setName(res.data)
            
        })
        .catch((error)=>{
            console.log('error fetchAccountsUrl',error);
        })
    }

  return (
   <>
    {name}

   </>
  )
}

export default AccountNames