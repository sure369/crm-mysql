import React, { useState } from 'react'
import Accounts from './index';
import AccountsMobile from './indexMobile';
import useViewport from '../../utility/useViewPort';

function ResponsiveAccounts() {

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