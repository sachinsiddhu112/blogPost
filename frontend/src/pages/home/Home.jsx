import React ,{useRef, Suspense } from 'react'
import {motion, useScroll, useTransform} from "framer-motion";
import Header from '../../components/header/Header.jsx'


import "./Home.css"
import Footer from '../../components/footer/Footer.jsx'

const  PostSection  = React.lazy(() => 
  import('../../components/postSection/PostSection.jsx')) ;

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
       <Suspense fallback = {<h2>Loading Posts...</h2>}>
       <PostSection/>
       </Suspense>
      </div>
       
       <Footer/>
      
     </div>
  )
}
