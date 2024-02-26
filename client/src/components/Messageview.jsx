import React from 'react'
import { useState, useEffect } from 'react'
import {Card} from 'react-bootstrap';
import { useParams} from "react-router-dom";
import Textinput from './Textinput';
import Sideview from './Sideview';
import Footer from './Footer';
import Header from './Header';

function Messageview() {
  const {id} = useParams();
  const[messages, setMessages]= useState([])

  useEffect(() => {
    async function fetchData(){
        try{
            await fetch(`/conversations/${id}`)
            .then(response => response.json())
            .then(data => setMessages(data))
        }catch (error){
            console.log('Error: ', error)
        }
    }
    fetchData()
},[id])
// console.log(messages)
  return (
    <div>
      <Header/>
      <div style={{ display: 'flex' }}>
        <Sideview/>
        <div style={{ flex: 1 }}>
          <h1 className="text-center mt-4">{messages.group_name}</h1>
          <hr />
          
          <hr />
          <Textinput id= {id}/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Messageview