import React from 'react'
import About from './About'

import FaqPage from './FaqPage'
import FavoritesPage from './FavoritesPage'
import Navbar from '../Products/Navbar'
import SearchBar from '../ManageAccount/Searchbar'
import Footer from '../Home/Flooter'

const AboutPageinfo = () => {

  return (
    <div className='bg-black'>
        <div className="bg-[#121318] min-h-screen">
            <Navbar/>
            <SearchBar/>
        <About/>
        <FaqPage/>
        <FavoritesPage/>
        <Footer/>
    </div>
    </div>
  )
}

export default AboutPageinfo
