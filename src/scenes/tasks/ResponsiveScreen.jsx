import React, { useState } from 'react'
import Task from '.';
import TaskMobile from './indexMobile';
import useViewport from '../../utility/useViewPort';    

function ResponsiveTasks() {

    const   {width ,breakpoint} =useViewport();
 
  return (
    <>
    {
        width < breakpoint ? <TaskMobile/> : <Task/>
    }
    </>
  )
}

export default ResponsiveTasks