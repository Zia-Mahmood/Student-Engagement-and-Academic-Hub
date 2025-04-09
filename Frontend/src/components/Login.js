import "../styles/Login.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// functional component
function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // Check if the user is already logged in

        // axios.get('http://localhost:5001/api/isAuth', { withCredentials: true })
        //     .then(response => {
        //         // If user is authenticated, redirect to dashboard or homepage
        //         if (response.status === 200) {
        //             navigate('/home'); // redirect to your protected page
        //         }
        //     })
        //     .catch(error => {
        //         console.log('User is not authenticated');
        //     });
        const checkAuth = async () => {
            //e.preventDefault();
            try {
                const response = await fetch('http://localhost:5001/api/isAuth', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.ok) {
                    //setError('');
                    //alert("Login successful!");
                    //onLogin();
                    navigate('/home');
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
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }
        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setError('');
                alert("Login successful!");
                onLogin();
                navigate('/home');
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
        <div className="login-container">
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                </div>
                <div class="button-container">
                    <button type="submit">Login</button>
                    <button type="button" onClick={handleSignUp}>Sign Up</button>
                </div>
            </form>
        </div>
    );
}

export default Login;