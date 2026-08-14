import React from 'react'
import NavBar from '../Components/NavBar'
import HeroPage from '../Components/HeroPage'
import ServiceComp from '../Components/ServiceComp'
import HealthPack from '../Components/HealthPack'
import Works from '../Components/Works'
import ClinicInfo from '../Components/ClinicInfo'
import Footer from '../Components/Footer'

const Home = () => {
  return (
    <section>
        <NavBar />
        <HeroPage/>
        <ServiceComp/>
        <HealthPack/>
        <Works/>
        <ClinicInfo/>
        <Footer/>
    </section>
  )
}

export default Home