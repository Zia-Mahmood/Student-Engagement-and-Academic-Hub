import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'

const Home = ({ onLogout }) => {
    const [todos, setTodos] = useState([]);
    const navigate = useNavigate();

    const fetchTodos = async () => {
        const response = await fetch('http://localhost:5001/api/isAuth', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const userSession = await response.json();
            const todoResponse = await fetch(`http://localhost:5001/api/getTodo`, {
                method: 'GET',
                credentials: 'include',
            });

            if (todoResponse.ok) {
                const data = await todoResponse.json();
                setTodos(data.data || []);
            } else {
                const errorData = await todoResponse.text(); // Get the raw text to see the error
                console.error('Error fetching todos:', errorData);
            }
        } else {
            const errorData = await response.text(); // Get the raw text to see the error
            console.error('User is not authenticated:', errorData);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleCreateTodo = () => {
        navigate('/create-todo'); // Redirect to Create Todo Page
    };

    return (
        <div className="home-container">
            <h2>My To-Do List</h2>
            <button className="logout-button" onClick={onLogout}>Logout</button>
            <ul>
                {todos.length > 0 ? (
                    todos.map((todo) => (
                        <li key={todo._id}>
                            <strong>{todo.title}</strong>: {todo.description} (Due: {new Date(todo.dueDate).toLocaleDateString()})
                        </li>
                    ))
                ) : (
                    <p>No tasks available.</p>
                )}
            </ul>
            <button onClick={handleCreateTodo}>Create New To-Do</button>
        </div>
    );
};

export default Home;
