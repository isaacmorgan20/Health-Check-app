import React from 'react'
import NavBar from '../Components/NavBar'
import HeroPage from '../Components/HeroPage'
import ServiceComp from '../Components/serviceComp'
import HealthPack from '../Components/HealthPack'
import Works from '../Components/Works'
import Footer from '../Components/Footer'

const Home = () => {
  return (
    <section>
        <NavBar />
        <HeroPage/>
        <ServiceComp/>
        <HealthPack/>
        <Works/>
        <Footer/>
    </section>
  )
}

export default Home