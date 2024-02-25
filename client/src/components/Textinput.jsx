import React from 'react'
import {Button, Form} from 'react-bootstrap'
import { useState} from 'react';

function Textinput() {

  const [message, setMessage] = useState("");

  const handleSubmit= (e) =>{
    e.preventDefault();
    console.log(message);
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Control as="textarea" placeholder='Message' className='h-8' rows={3} onChange={(e)=> {setMessage(e.target.value)}}/>
          <Button className='text-white bg-green-600 mt-1' variant="success" type="submit">
            Send
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default Textinput