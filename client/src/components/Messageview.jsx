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
  const [allMessages, setAllMessages]= useState([]);

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

useEffect(() => {
  async function fetchData(){
      try{
          await fetch(`/messages`)
          .then(response => response.json())
          .then(data => setAllMessages(data))
      }catch (error){
          console.log('Error: ', error)
      }
  }
  fetchData()
},[id])
console.log(allMessages)

  const displayCard= allMessages.map((item) => {
    // console.log(item.content)
    if (parseInt(item.conversation_id) === parseInt(id)) {
      return (
        <Card className='ml-6 mt-2' key={item.id} style={{ width: '65rem' }}>
          <Card.Body>
            <Card.Text>{item.content}</Card.Text>
            <Card.Text>{item.created_at}</Card.Text>
          </Card.Body>
        </Card>
      );
    }
  })

  return (
    <div>
      <Header/>
      <div style={{ display: 'flex' }}>
        <Sideview/>
        <div style={{ flex: 1 }}>
          <h1 className="text-center mt-4 font-semibold text-2xl">{messages.group_name}</h1>
            {/* Display all messages in the conversation */}
            {displayCard}
          <Textinput id= {id}/>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Messageview