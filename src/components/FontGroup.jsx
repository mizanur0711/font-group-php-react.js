import React, { useState, useEffect } from 'react';
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, Button } from '@mui/material';
import axios from 'axios';

function FontGroup() {
    const [fonts, setFonts] = useState([]);
    const [rows, setRows] = useState([{ fontId: '', fontName: '', dummyField1: '', dummyField2: '' }]);
    const [selectedFonts, setSelectedFonts] = useState([]);
    const [groupName, setGroupName] = useState('');

    useEffect(() => {
        // Fetch fonts from the backend
        axios.get('http://localhost:8000/php-backend/get_fonts.php')
            .then(response => {
                if (response.data.status === 'success') {
                    setFonts(response.data.fonts);
                } else {
                    console.error('Failed to fetch fonts:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching fonts:', error);
            });
    }, []);

    // Add a new row to the table
    const addRow = () => {
        setRows([...rows, { fontId: '', fontName: '', dummyField1: '', dummyField2: '' }]);
    };

    // Handle font selection in a row
    const handleFontSelect = (index, selectedFontId) => {
        const selectedFont = fonts.find((font) => font.id === selectedFontId);
        const newRows = [...rows];
        const newSelectedFonts = [...selectedFonts];

        // If a font was previously selected in this row, remove it from the selected list
        if (newRows[index].fontId) {
            const prevSelectedIndex = newSelectedFonts.indexOf(newRows[index].fontId);
            if (prevSelectedIndex !== -1) {
                newSelectedFonts.splice(prevSelectedIndex, 1);
            }
        }

        // Update the row with the new font selection
        newRows[index].fontId = selectedFontId;
        newRows[index].fontName = selectedFont ? selectedFont.font_name : '';

        // Add the newly selected font to the selected fonts list
        if (selectedFontId) {
            newSelectedFonts.push(selectedFontId);
        }

        setRows(newRows);
        setSelectedFonts(newSelectedFonts);
    };

    // Handle input changes for dummy fields
    const handleInputChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

    // Get the list of fonts available for selection in each row (filter out already selected fonts)
    const getAvailableFonts = () => {
        return fonts.filter((font) => !selectedFonts.includes(font.id));
    };

    // Handle the "Create" button click
    const handleCreate = () => {
        // Prepare the font IDs and dummy field data
        const fontIds = rows.map(row => row.fontId).filter(id => id); // Only get non-empty font IDs
        if (!groupName || fontIds.length === 0) {
            alert('Please enter a group name and select at least one font.');
            return;
        }

        // Data to send to the backend
        const data = {
            group_name: groupName,
            fonts: rows.map(row => ({
                font_id: row.fontId,
                dummy1: row.dummyField1,
                dummy2: row.dummyField2
            }))
        };

        // Send data to the backend for creating the group
        axios.post('http://localhost:8000/php-backend/create_font_group.php', data)
            .then(response => {
                if (response.data.status === 'success') {
                    alert('Font group created successfully!');
                } else {
                    alert('Error creating font group: ' + response.data.message);
                }
            })
            .catch(error => {
                console.error('Error creating font group:', error);
                alert('Failed to create font group.');
            });
    };

    return (
        <div>
            <h2>Create Font Group</h2>

            {/* Group Name Input */}
            <TextField
                label="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                fullWidth
                style={{ marginBottom: '20px' }}
            />

            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Select Font</TableCell>
                            <TableCell>Font Name</TableCell>
                            <TableCell>Dummy Field 1</TableCell>
                            <TableCell>Dummy Field 2</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                {/* Font Selection */}
                                <TableCell>
                                    <Select
                                        value={row.fontId}
                                        onChange={(e) => handleFontSelect(index, e.target.value)}
                                        displayEmpty
                                        fullWidth
                                        renderValue={(selected) => {
                                            if (selected) {
                                                return fonts.find((font) => font.id === selected)?.font_name || 'Select Font';
                                            }
                                            return 'Select Font';
                                        }}
                                    >
                                        <MenuItem value=""><em>Select Font</em></MenuItem>
                                        {getAvailableFonts().length > 0 ? (
                                            getAvailableFonts().map((font) => (
                                                <MenuItem key={font.id} value={font.id}>
                                                    {font.font_name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No fonts available</MenuItem>
                                        )}
                                    </Select>
                                </TableCell>

                                {/* Font Name (Display) */}
                                <TableCell>
                                    <TextField
                                        value={row.fontName}
                                        disabled
                                        fullWidth
                                    />
                                </TableCell>

                                {/* Dummy Field 1 */}
                                <TableCell>
                                    <TextField
                                        placeholder="Dummy Field 1"
                                        type="number"
                                        value={row.dummyField1}
                                        onChange={(e) => handleInputChange(index, 'dummyField1', e.target.value)}
                                        fullWidth
                                    />
                                </TableCell>

                                {/* Dummy Field 2 */}
                                <TableCell>
                                    <TextField
                                        placeholder="Dummy Field 2"
                                        type="number"
                                        value={row.dummyField2}
                                        onChange={(e) => handleInputChange(index, 'dummyField2', e.target.value)}
                                        fullWidth
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Buttons below the last row */}
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={addRow} variant="contained" color="primary">
                    Add Row
                </Button>

                <Button onClick={handleCreate} variant="contained" color="success">
                    Create
                </Button>
            </div>
        </div>
    );
}

export default FontGroup;
