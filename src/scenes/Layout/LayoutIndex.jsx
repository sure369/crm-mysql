import React from 'react'
import AppNavbar from '../global/AppNavbar'
import { Routes,Route } from 'react-router-dom'
import ResponsiveInventories from '../inventories/ResponsiveScreen'

function LayoutIndex() {
  return (
    <>
    <AppNavbar>
    <Routes>
        <Route path="/" element={<ResponsiveInventories/>}/>
      </Routes>
      </AppNavbar>
    </>
    )
}

export default LayoutIndex