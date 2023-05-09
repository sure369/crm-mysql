import React, { useState } from 'react'
import Accounts from './index';
import AccountsMobile from './indexMobile';
import useViewport from '../../utility/useViewPort';
import { useLocation } from 'react-router-dom';

function ResponsiveAccounts() {
  const location = useLocation();

  console.log(location,"RES location")

 const{width,breakpoint}=useViewport();
 
  return (
    <>
    {
        width < breakpoint ? <AccountsMobile/> : <Accounts/>
    }
    </>
  )
}

export default ResponsiveAccounts