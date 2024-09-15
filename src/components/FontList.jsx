import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import '../App.css'; // Make sure this CSS file contains the .preview-image class

function FontList() {
    const [fonts, setFonts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/php-backend/get_fonts.php')
            .then(response => {
                if (response.data.status === 'success') {
                    setFonts(response.data.fonts);
                } else {
                    console.error('Failed to fetch fonts:', response.data.message);
                }
            })
            .catch(error => console.error('Error fetching fonts:', error));
    }, []);

    const handleDelete = (id) => {
        // Implement delete functionality
        console.log('Delete font with ID:', id);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Font Name</TableCell>
                        <TableCell>Preview</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fonts.map(font => (
                        <TableRow key={font.id}>
                            <TableCell>{font.font_name}</TableCell>
                            <TableCell>
                                {font.preview_image ? (
                                    <img
                                        src={`data:image/png;base64,${font.preview_image}`}
                                        alt={font.font_name}
                                        className="preview-image"
                                    />
                                ) : (
                                    <Typography variant="body2">No preview available</Typography>
                                )}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={() => handleDelete(font.id)} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default FontList;
