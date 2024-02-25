import React from 'react'
import Header from './Header'
import Sideview from './Sideview'
import Footer from './Footer'
import Defaulthome from './Defaulthome'

function Home() {
  return (
    <div>
      <Header/>
      <div style={{ display: 'flex' }}>
        <Sideview/>
        <div style={{ flex: 1 }}>
          <Defaulthome/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Home