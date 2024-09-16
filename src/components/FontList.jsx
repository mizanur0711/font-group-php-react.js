import React from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import '../App.css'; // Ensure this file contains the necessary CSS for preview images

function FontList({ fonts, onDelete }) {
    console.log('FontList received fonts:', fonts);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this font?")) {
            axios.post('http://localhost:8000/php-backend/delete_font.php', new URLSearchParams({ id }))
                .then(response => {
                    console.log('Delete response:', response.data);

                    if (response.data.success) {
                        alert('Font deleted successfully!');
                        if (onDelete) onDelete(); // Trigger re-fetch of the font list
                    } else {
                        alert(`Failed to delete font: ${response.data.message}`);
                    }
                })
                .catch(error => {
                    console.error('Error deleting font:', error);
                    alert('An error occurred while trying to delete the font.');
                });
        }
    };

    return (
        <Container >
            <Paper className="custom-container">
            <Typography variant="h4" component="h4" gutterBottom>
                Our Fonts
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
                rowse a list of Zepto fonts to build your font group
            </Typography>
        <TableContainer>
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
            </Paper>
        </Container>
    );
}

export default FontList;
