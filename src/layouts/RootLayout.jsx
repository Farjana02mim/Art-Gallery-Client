import React from 'react'
import Footer from '../pages/Shared/Footer/Footer'
import Navbar from '../pages/Shared/NavBar/Navbar'
import { Outlet } from 'react-router'

const RootLayout = () => {
  return (
    <div >
      <div className='max-w-7xl mx-auto'>
      <Navbar></Navbar>
      <Outlet>
        
      </Outlet>
      <Footer></Footer>
    </div>
    </div>
  )
}

export default RootLayout
