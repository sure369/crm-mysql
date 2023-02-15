import React from 'react'
import Leads from '.';
import LeadsMobile from './indexMobile';
import useViewport from '../../utility/useViewPort';    

function ResponsiveLeads() {

    const   {width ,breakpoint} =useViewport();
 
  return (
    <>
    {
        width < breakpoint ? <LeadsMobile/> : <Leads/>
    }
    </>
  )
}

export default ResponsiveLeads