import React, { useState, useEffect } from 'react';
import FontUpload from './components/FontUpload';
import FontList from './components/FontList';
import { Container } from '@mui/material';
import axios from 'axios';

function App() {
    const [fonts, setFonts] = useState([]);

    const fetchFonts = () => {
        axios.get('http://localhost:8000/php-backend/get_fonts.php')
            .then(response => {
                console.log('Fonts response:', response.data);
                if (response.data.status) {
                    setFonts(response.data.fonts);
                    console.log('Fonts set:', response.data.fonts);
                }
            })
            .catch(error => {
                console.error('Error fetching fonts:', error);
            });
    };

    useEffect(() => {
        fetchFonts();
    }, []);

    const refreshFontList = () => {
        fetchFonts();
    };

    return (
        <Container>
            <FontUpload onUpload={refreshFontList} />
            <FontList fonts={fonts} />
        </Container>
    );
}

export default App;
