import React from 'react'
import Header from './Header'
import Sideview from './Sideview'
import Footer from './Footer'
import Textinput from './Textinput'
import Messageview from './Messageview'

function Home() {
  return (
    <div>
      <Header/>
      <div style={{ display: 'flex' }}>
        <Sideview/>
        <div style={{ flex: 1 }}>
          <Messageview/>
          <Textinput/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Home