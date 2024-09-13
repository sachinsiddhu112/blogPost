import React ,{useRef } from 'react'
import {motion, useScroll, useTransform} from "framer-motion";
import Header from '../../components/header/Header.jsx'
import Posts from '../posts/Posts.jsx'

import "./Home.css"
import Footer from '../../components/footer/Footer.jsx'
import PostSection from '../../components/postSection/PostSection.jsx';
export default function Home() {
 const ref = useRef(null);
 const { scrollYProgress } = useScroll({
  target:ref,
  offset:["end end", "end center"]
})
const scaleY = useTransform(scrollYProgress, [0,1],[.6,1]);


  return (

    <div className='home-container'  >
      <div ref={ref} className='content'>
       <Header />
       <PostSection/>
      </div>
       
       <Footer/>
      
     </div>
  )
}
