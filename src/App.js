import React, { useEffect, useState } from 'react';
import { Button, Container, Typography } from '@mui/material';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:8000/index.php')
            .then((response) => response.json())
            .then((data) => setMessage(data.message))
            .catch((error) => console.error('Error fetching message:', error));
    }, []);

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                Font Group System
            </Typography>
            <Typography variant="h6">
                {message ? message : 'Loading...'}
            </Typography>
            <Button variant="contained" color="primary">
                testing
            </Button>
        </Container>
    );
}

export default App;
