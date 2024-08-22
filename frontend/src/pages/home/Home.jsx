import React from 'react'
import Header from '../../components/header/Header.jsx'
import Posts from '../../components/posts/Posts.jsx'

import "./Home.css"
import Footer from '../../components/footer/Footer.jsx'
export default function Home() {
  return (
    <div className='home-container' >
      <Header/>
      <Posts/>

      <div className='footer' >
        <hr className='divider'/>
      <Footer/>
      </div>
    </div>
  )
}
