import React from 'react'
import {Button, Form} from 'react-bootstrap'
import { useState} from 'react';

function Textinput({id}) {

  const [message, setMessage] = useState("");
  const[loading, setLoading]= useState(false);
  // const [error, setError ]=useState(null)

  const handleSubmit= async (e) =>{
    e.preventDefault();
    const formData  = {
      content: message,
      conversation_id: id
    }
    setLoading(true)
    try {
      const response = await fetch('/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Data posted successfully:', data);
    } 
    catch (error) {
      // setError(error.message);
      console.log('Error posting data:', error);
    }
    finally {
      setLoading(false);
      window.location.reload()
    }
  }
  if(loading){
    return <p>Loading...</p>
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