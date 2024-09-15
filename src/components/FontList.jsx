import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import '../App.css';

function FontList({ fonts }) {
    console.log('FontList received fonts:', fonts);

    const handleDelete = (id) => {
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
