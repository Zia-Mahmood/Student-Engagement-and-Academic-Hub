import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateTodo.css'

const CreateTodo = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const navigate = useNavigate();

    const handleCreateTodo = async (e) => {
        e.preventDefault();
        const authResponse = await fetch('http://localhost:5001/api/isAuth', {
            method: 'GET',
            credentials: 'include',
        });

        if (authResponse.ok) {
            const userSession = await authResponse.json();
            const todoResponse = await fetch('http://localhost:5001/api/addTodo', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    dueDate // Ensure the username is coming from a valid session
                }),
            });
            console.log(todoResponse);
            setTimeout('', 10000);
            if (todoResponse.ok) {
                const data = await todoResponse.json();
                console.log(data.msg);
                alert(`Title: ${title}\nDescription: ${description}\nDue Date: ${new Date(dueDate).toLocaleDateString()}`);
                navigate('/home');
            } else {
                const errorData = await todoResponse.text(); // Get the raw text to see the error
                console.error('Error creating todo:', errorData);
            }
        } else {
            const errorData = await authResponse.text(); // Get the raw text to see the error
            console.error('User is not authenticated:', errorData);
        }
    };

    return (
        <div className="create-todo-container">
            <h2>Create a New To-Do</h2>
            <form onSubmit={handleCreateTodo}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label>Due Date:</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                    />
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
};

export default CreateTodo;
