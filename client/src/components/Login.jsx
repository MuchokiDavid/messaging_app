import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Header from './Header';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate()

    const handleSubmit= async (e) =>{
        e.preventDefault();
        if(password==="" && username === ""){
            Swal.fire({
                title: 'Warning!',
                text: "Please fill out all fields",
                icon: 'warning',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-danger'
                }
              })
        } 
        else {
            const formData  = {
                username: username,
                password: password
            }
            try {
            const response = await fetch('/login', {
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
                Swal.fire({
                    title: 'success',
                    text: 'Log in successiful',
                    icon: 'success',
                });
                navigate('/home')
            } 
            catch (error) {
            // setError(error.message);
                console.log('Error posting data:', error);
            }
            // finally {
            //    pass
            // }
        }

    }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Header/>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Form className='login-form' onSubmit={handleSubmit}>
                <Form.Text className='text-black font-bold text-3xl'>Login</Form.Text>
                <Form.Group className="mb-3 mt-5" controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control onChange={(e)=> {setUsername(e.target.value)}} className='w-1/2 mx-44' type="text" placeholder="Enter username" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={(e)=> {setPassword(e.target.value)}} className='w-1/2 mx-44' type="password" placeholder="Password" />
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