import React, { useState } from 'react';
import './Navbar.css';
import {Link} from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu';

function Navbar() {
   
    const [showMediaIcons,setShowMediaIcons] =useState(false);
  return (
    <>
        <nav className='main-nav'>
            {/* 1st logo part */}
            <div className='logo'>
                <h2>
                   Clouddesk
                </h2>
            </div>
            {/* 2nd menu part */}
            <div
                className={showMediaIcons ? " mobile-menu-link" : "menu-link"} 
            >
                {/* style={{ color: 'blue', lineHeight : 10, padding: 20 }} */}
                <ul>
                    <Link to='/' className='home'>
                        <li> Home </li>
                    </Link>
                    <Link to='/leads' className='leads'>
                        <li> Leads </li>
                    </Link>
                    <Link to='/opportunities' className='opportunities'>
                        <li> Opportunities </li>
                    </Link>
                    <Link to='/inventories' className='inventories'>
                        <li> Inventories </li>
                    </Link>
                    <Link to='/accounts' className='accounts'>
                        <li> Accounts </li>
                    </Link>
                    <Link to='/contacts' className='contacts'>
                        <li> Contacts </li>
                    </Link>
                    <Link to='/users' className='users'>
                        <li> Users </li>
                    </Link>
                </ul>
            </div>
            {/* 3rd social media links */}
            <div className='social-media'>
                
                    {/* hamburget menu start */}
                    <div className='hamburger-menu'>
                        <a href='#'onClick={()=>setShowMediaIcons(!showMediaIcons)} >
                            <MenuIcon/>
                        </a>
                        
                    </div>
            </div>
            </nav>

          
          
        
    </>

  )
}

export default Navbar