import "../styles/Login.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, IconButton, InputAdornment, TextField, Typography, Paper } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const url = "http://localhost:3000/api";

// functional component
function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(url + '/isAuth', {
                    method: 'GET',
                    withCredentials: true,
                    credentials: 'include'
                });
                if (response.ok) {
                    navigate('/');
                } else {
                    const errorData = await response.text(); // Get the raw text to see the error
                    console.log('User is not authenticated:', errorData);
                }
            } catch (error) {
                console.log(error);
                setError('An error occurred during Authentication');
            }
        }
        checkAuth();
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both username and password');
            return;
        }
        try {
            const response = await fetch(url + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setError('');
                console.log(data)
                //alert("Login successful!");
                onLogin();
                navigate('/');
            } else {
                setError(data.msg || 'Login failed');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred during login');
        }
    };

    const handleSignUp = () => {
        navigate('/register');
    };

    return (
        <Box sx={{display:'flex', flexDirection:'column',mt:'5%'}}>
            <Container maxWidth="sm" sx={{ alignSelf: 'center', flexDirection: 'column',width:'40%',alignItems:"center" }}>
                <Box component="img" sx={{width:'80%',height:'80%',mb:4,ml:6}} src="/iiit-logo-white.png" alt="IIITH Logo" />
                <Typography variant="h5" sx={{ mb: 3, color: '#FFFFFF', fontWeight: 600 ,textAlign:'center'}}>
                    Enter Credentials
                </Typography>
                <Box component="form" onSubmit={handleLogin} noValidate>
                    <TextField
                        fullWidth
                        required
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        variant="standard"
                        InputLabelProps={{ style: { color: '#FFFFFF',background:'transparent' } }}
                        InputProps={{
                            style: { color: '#FFFFFF' },
                            sx: {
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ffffff' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8EB8FF' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8EB8FF' },
                            },
                        }}
                    />

                    <TextField
                        fullWidth
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        margin="normal"
                        variant="standard"
                        InputLabelProps={{ style: { color: '#A3A8C5' } }}
                        InputProps={{
                            style: { color: '#FFFFFF' },
                            sx: {
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#A3A8C5' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#A3A8C5' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#A3A8C5' },
                            },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: '#A3A8C5' }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 4,
                            py: 1.5,
                            borderRadius: '999px',
                            backgroundColor: '#7A7A7A',
                            fontWeight: 700,
                            fontSize: '1.125rem',
                            '&:hover': { backgroundColor: '#548eb8' },
                        }}
                    >
                        Log In
                    </Button>
                </Box>
            </Container>
        </Box>

        // <div className="login-container">
        //     <div className="logo-div">
        //         <img src="/iiit-logo-white.png" alt="IIITH-LOGO"/>
        //     </div>
        //     <h2>Enter Credentials</h2>
        //     {error && <p style={{ color: 'red' }}>{error}</p>}
        //     <form onSubmit={handleLogin}>
        //         <div>
        //             <input
        //                 type="text"
        //                 value={email}
        //                 onChange={(e) => setEmail(e.target.value)}
        //                 placeholder="Email"
        //             />
        //         </div>
        //         <div>
        //             <input
        //                 type="password"
        //                 value={password}
        //                 onChange={(e) => setPassword(e.target.value)}
        //                 placeholder="Password"
        //             />
        //         </div>
        //         <div class="button-container">
        //             <button type="submit">Login</button>
        //         </div>
        //     </form>
        // </div>
    );
}

export default Login;