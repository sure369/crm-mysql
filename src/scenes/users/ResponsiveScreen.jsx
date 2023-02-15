import React from 'react'
import useViewport from '../../utility/useViewPort';    
import Users from '.';
import UsersMobile from './indexMobile';

function ResponsiveUsers() {

    const   {width ,breakpoint} =useViewport();
 
  return (
    <>
    {
        width < breakpoint ? <UsersMobile/> : <Users/>
    }
    </>
  )
}

export default ResponsiveUsers