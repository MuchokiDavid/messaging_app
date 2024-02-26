import React from 'react'
import { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate} from "react-router-dom";

function Sideview() {
    const [conversations, setConversations]= useState([])
    const [postConversation, setpostConversation] = useState("")
    const[loading, setLoading]= useState(false);
    const navigate = useNavigate();
    

    useEffect(()=>{
        async function fetchData(){
            try{
                await fetch('/conversations')
                .then(response => response.json())
                .then(data => setConversations(data))
            }catch (error){
                console.log('Error: ', error)
            }
        }
        fetchData()
    },[])
    
    const handleSidebarClick= (id)=>{
      navigate(`/conversations/${id}`);
    }

    const  handleSubmit= async(event) => {
        event.preventDefault();
        // console.log(postConversation)
        const formData  = {group_name: postConversation}
        setLoading(true)
        try {
          const response = await fetch('/conversations', {
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
    <div className="lg:w-64">
        <Sidebar>
            <Menu
            menuItemStyles={{
                button: ({ level, active, disabled }) => {
                  // only apply styles on first level elements of the tree
                  if (level === 0)
                    return {
                      color: disabled ? '#f5d9ff' : '#000000',
                      backgroundColor: active ? '#eecef9' : undefined,
                      textAlign: 'left',
                      height: "40px",
                      border: '0.5px solid #f0f0f0',
                    };
                    
                },
              }}
            >
              {/* <h3 className='text-left text-lg font-semibold pl-4'>Conversations</h3> */}
              <MenuItem > 
              <Form className="d-flex p-0 w-52" >
                <Form.Control
                  type="text"
                  placeholder="New Conversation"
                  className="me-2"
                  onChange={(e) => setpostConversation(e.target.value)}
                />
                <Button className='text-white bg-green-600 mt-1' onClick={handleSubmit}>
                  Add 
                </Button>
              </Form>
              </MenuItem>
                {conversations.map((item) => (
                    <MenuItem onClick={()=> handleSidebarClick(item.id)} key={item.id}>{item.group_name}</MenuItem>
                ))}
            </Menu>
        </Sidebar>
    </div>
  )
}

export default Sideview