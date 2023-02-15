import React, { useState } from 'react'
import Contacts from '.';
import ContactsMobile from './indexMobile';
import useViewport from '../../utility/useViewPort';    

function ResponsiveContacts() {

    const   {width ,breakpoint} =useViewport();
 
  return (
    <>
    {
        width < breakpoint ? <ContactsMobile/> : <Contacts/>
    }
    </>
  )
}

export default ResponsiveContacts