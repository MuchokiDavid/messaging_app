import React from 'react'

function Defaulthome() {
  return (
    <div className='text-center justify-center items-center h-full'>
        <div>
            <h1 className='m-6 text-3xl text-center'>Welcome to our Messaging App!</h1>
            <p className='text-lg m-2'>Take your conversations to the next level with our Messaging App. Whether you're joining existing discussions or starting new ones, our platform makes communication effortless and engaging.</p>
            <h2 className='mt-3 mb-3 text-xl'>Key Features:</h2>
            <ul>
                <li className="text-lg mb-4">Join Existing Conversations</li>
                <li className="text-lg mb-4">Create New Conversations</li>
                <li className="text-lg mb-4">Real Time Chatting</li>
                <li className="text-lg mt-4">Intuitive Interface.</li>
            </ul>
            <p className='mt-6'>Join us today and be part of a vibrant community of communicators and collaborators!</p>
        </div>
    </div>
  )
}

export default Defaulthome