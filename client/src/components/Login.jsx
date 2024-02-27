import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

function Login() {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header/>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Form className='login-form' method="post"  action="/login">
                <Form.Text className='text-black font-bold text-3xl'>Login</Form.Text>
                <Form.Group className="mb-3 mt-5" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control className='w-1/2 mx-44' type="text" placeholder="Enter username" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control className='w-1/2 mx-44' type="password" placeholder="Password" />
                </Form.Group>
                <Button className='text-white bg-green-600 mt-1 mb-6' variant="success" type="submit">
                    Log in
                </Button><br/>
                <Link to={`/signup`} className='text-blue-800 font-medium underline-offset-8'>Don't have and account? Signup Here</Link>
            </Form>
            
        </div>
        <Footer/>
    </div>
    
  )
}

export default Login