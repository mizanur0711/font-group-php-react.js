import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Container
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import '../App.css';

function FontGroupList({ refreshFontGroups }) {
    const [fontGroups, setFontGroups] = useState([]);

    useEffect(() => {
        // Fetch font groups
        axios.get('http://localhost:8000/php-backend/get_font_groups.php')
            .then(response => {
                console.log('Font groups fetched from backend:', response.data); // Debugging output
                if (response.data.status === 'success') {
                    setFontGroups(response.data.groups);
                } else {
                    console.error('Failed to fetch font groups:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching font groups:', error);
            });
    }, [refreshFontGroups]);

    const handleEdit = (id) => {
        // Handle edit functionality
        console.log('Edit font group with ID:', id);
    };

    const handleDelete = (id) => {
        // Handle delete functionality
        axios.post('http://localhost:8000/php-backend/delete_font_group.php', { id })
            .then(response => {
                if (response.data.status === 'success') {
                    // Remove deleted group from state
                    setFontGroups(fontGroups.filter(group => group.id !== id));
                } else {
                    console.error('Failed to delete font group:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error deleting font group:', error);
            });
    };

    return (
        <Container>
            <Paper className="custom-container">
            <h2>Font Groups</h2>

            <TableContainer style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Group Name</TableCell>
                            <TableCell>Font Names</TableCell>
                            <TableCell>Font Count</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {fontGroups.map(group => (
                            <TableRow key={group.id}>
                                <TableCell>{group.group_name}</TableCell>
                                <TableCell>{group.font_names}</TableCell>
                                <TableCell>{group.font_count}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(group.id)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(group.id)} color="error">
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

export default FontGroupList;
