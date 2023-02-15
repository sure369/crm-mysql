import React, { useState } from 'react'
import Inventories from '.';
import InventoriesMobile from './indexMobile';
import useViewport from '../../utility/useViewPort';    

function ResponsiveInventories() {

    const   {width ,breakpoint} =useViewport();
 
  return (
    <>
    {
        width < breakpoint ? <InventoriesMobile/> : <Inventories/>
    }
    </>
  )
}

export default ResponsiveInventories