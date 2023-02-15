import React from 'react'
import Opportunities from '.';
import OpportunitiesMobile from './indexMobile';
import useViewport from '../../utility/useViewPort';    

function ResponsiveOpportunities() {

    const   {width ,breakpoint} =useViewport();
 
  return (
    <>
    {
        width < breakpoint ? <OpportunitiesMobile/> : <Opportunities/>
    }
    </>
  )
}

export default ResponsiveOpportunities