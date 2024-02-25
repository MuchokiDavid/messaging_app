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
    console.log(conversations)
    
  return (
    <div>
        <Sidebar>
            <Menu>
                {conversations.map((item, index) => (
                    <MenuItem key={item[0][index].id}>{item[0][index].group_name}</MenuItem>
                ))}
            </Menu>
        </Sidebar>
    </div>
  )
}

export default Sideview