import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Header from './Header';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

function SignUp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail]= React.useState('');
    const [confirmPassword, setConfirmPassword]= React.useState('');
    const[loading, setLoading]= useState(false);
    const  navigate= useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        if  (password !== confirmPassword){
            // alert("Passwords do not match.");
            Swal.fire({
                title: 'Error!',
                text: 'Password does not match',
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    confirmButton: 'btn btn-danger'
                }
              });

        }
        else if(password==="" && email === ""  && username===""){
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
        else{
            const formData  = {
                username: username,
                email: email,
                _password_hash: password
            }
            setLoading(true)
            try {
            const response = await fetch('/users', {
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
                Swal.fire({
                    title: 'success',
                    text: 'Account created',
                    icon: 'success',
                });
                navigate('/login')
            }
        }
    }
    if(loading){
        return <p>Loading...</p>
    }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header/>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Form className='login-form' onSubmit={handleSubmit}>
                    <Form.Text className='text-black font-bold text-3xl'>Sign up</Form.Text>
                    <Form.Group className="mb-3 mt-5" controlId="formBasicEmail1">
                        <Form.Label>Username</Form.Label>
                        <Form.Control onChange={(e)=> {setUsername(e.target.value)}} className='w-1/2 mx-44' type="text" placeholder="Enter username" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail2">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control onChange={(e)=> {setEmail(e.target.value)}} className='w-1/2 mx-44' type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword1">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={(e)=> {setPassword(e.target.value)}} className='w-1/2 mx-44' type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword2">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control onChange={(e)=> {setConfirmPassword(e.target.value)}} className='w-1/2 mx-44' type="password" placeholder="Confirm Password" />
                    </Form.Group>
                    <Button className='text-white bg-green-600 mt-1 mb-6' variant="success" type="submit">
                        Sign up
                    </Button><br/>
                    <Link to={`/`} className='text-blue-800 font-medium underline-offset-8'>Have an account? Log in Here</Link>
                </Form>
            </div>
        <Footer/>
    </div>
  )
}

export default SignUp