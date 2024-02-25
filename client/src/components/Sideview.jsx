import React from 'react'
import { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';


function Sideview() {
    const [conversations, setConversations]= useState([])

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
    // console.log(conversations)
    
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
                      textAlign: 'left'
                    };
                    
                },
              }}
            >
                {conversations.map((item) => (
                    <MenuItem key={item.id}>{item.group_name}</MenuItem>
                ))}
            </Menu>
        </Sidebar>
    </div>
  )
}

export default Sideview