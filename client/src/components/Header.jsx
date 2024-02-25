import React from 'react'
import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate();

  const handleClick= () =>{
    navigate('/');
  }
  return (
    <div>
      <h1 onClick={handleClick} className='text-left text-3xl font-bold p-10 bg-green-400 font-sans'>Message App</h1>
    </div>
  )
}

export default Header