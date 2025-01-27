import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='flex items-center justify-between gap-4 py-3 mt-20'>

      <NavLink to='/'>
        <div className="flex gap-2 items-center">
          <img src="/logo.png" className="h-8 w-8"></img>
          <h1 className="text-2xl">Image Gini</h1>
        </div>
      </NavLink>

      <p className='flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500
        max-sm:hidden'>© 2025 Image Gini | All rights reserved.</p>

      <div className='flex gap-2.5'>
        <img src={assets.facebook_icon} alt='' width={35} />
        <img src={assets.twitter_icon} alt='' width={35} />
        <img src={assets.instagram_icon} alt='' width={35} />
      </div>
    </div>
  )
}

export default Footer