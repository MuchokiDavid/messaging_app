import React from 'react'
import Header from './Header'
import Sideview from './Sideview'
import Footer from './Footer'
import Textinput from './Textinput'

function Home() {
  return (
    <>
      <Header/>
      <Sideview>
        <Textinput/>
      </Sideview>
      <Footer/>
    </>
  )
}

export default Home