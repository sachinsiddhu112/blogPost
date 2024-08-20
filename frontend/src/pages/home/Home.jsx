import React from 'react'
import Header from '../../components/header/Header.jsx'
import Posts from '../../components/posts/Posts.jsx'

import "./Home.css"
export default function Home() {
  return (
    <div className='home-container' >
      <Header/>
      <Posts/>
    </div>
  )
}
