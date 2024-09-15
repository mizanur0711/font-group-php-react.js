// App.jsx
import React, { useState, useEffect } from 'react';
import FontUpload from './components/FontUpload';
import FontList from './components/FontList';
import { Container } from '@mui/material';
import axios from 'axios';

function App() {
    const [fonts, setFonts] = useState([]);

    // Function to fetch the font list
    const fetchFonts = () => {
        axios.get('http://localhost:8000/php-backend/get_fonts.php')
            .then(response => {
                if (response.data.status === 'success') {
                    setFonts(response.data.fonts);
                }
            })
            .catch(error => console.error('Error fetching fonts:', error));
    };

    // Fetch fonts on initial render
    useEffect(() => {
        fetchFonts();
    }, []);

    // Function to refresh the font list
    const refreshFontList = () => {
        fetchFonts();
    };

    return (
        <Container>
            <FontUpload onUpload={refreshFontList} />
            <FontList fonts={fonts} onRefresh={fetchFonts} />
        </Container>
    );
}

export default App;
