import React, { useState, useEffect } from 'react';
import {
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Button,
    Typography,
    Container
} from '@mui/material';
import axios from 'axios';
import FontGroupList from './FontGroupList';
import '../App.css';


function FontGroup() {
    const [fonts, setFonts] = useState([]);
    const [rows, setRows] = useState([{ fontId: '', fontName: '' }]);
    const [selectedFonts, setSelectedFonts] = useState([]);
    const [groupName, setGroupName] = useState('');
    const [refreshFontGroups, setRefreshFontGroups] = useState(false);

    useEffect(() => {
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

    const addRow = () => {
        setRows([...rows, { fontId: '', fontName: '' }]);
    };

    const handleFontSelect = (index, selectedFontId) => {
        const selectedFont = fonts.find((font) => font.id === selectedFontId);
        const newRows = [...rows];
        const newSelectedFonts = [...selectedFonts];

        if (newRows[index].fontId) {
            const prevSelectedIndex = newSelectedFonts.indexOf(newRows[index].fontId);
            if (prevSelectedIndex !== -1) {
                newSelectedFonts.splice(prevSelectedIndex, 1);
            }
        }


        newRows[index].fontId = selectedFontId;
        newRows[index].fontName = selectedFont ? selectedFont.font_name : '';


        if (selectedFontId) {
            newSelectedFonts.push(selectedFontId);
        }

        setRows(newRows);
        setSelectedFonts(newSelectedFonts);
    };

    const getAvailableFonts = () => {
        return fonts.filter((font) => !selectedFonts.includes(font.id));
    };


    const handleCreate = () => {
        const fontIds = rows.map(row => row.fontId).filter(id => id);
        if (!groupName || fontIds.length < 2) {
            alert('Please enter a group name and select at least two fonts.');
            return;
        }


        const data = {
            group_name: groupName,
            fonts: rows.map(row => ({
                font_id: row.fontId
            }))
        };

        axios.post('http://localhost:8000/php-backend/create_font_group.php', data)
            .then(response => {
                if (response.data.status === 'success') {
                    alert('Font group created successfully!');
                    setGroupName('');
                    setRows([{ fontId: '', fontName: '' }]);
                    setRefreshFontGroups(prev => !prev);
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
        <Container>
            <Paper className="custom-container">
                <Typography variant="h4" component="h4" gutterBottom>
                    Create Font Group
                </Typography>
                <Typography variant="body1" component="p" gutterBottom>
                    You have to select at least two fonts
                </Typography>


                <TextField
                    label="Group Name"
                    variant="outlined"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    fullWidth
                    style={{ marginBottom: '20px' }}
                />

                <TableContainer style={{ marginTop: '20px' }}>
                    <Table>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <TextField
                                            label="Font Name"
                                            variant="outlined"
                                            value={row.fontName}
                                            fullWidth
                                        />
                                    </TableCell>

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

                                    <TableCell>
                                        <TextField
                                            label="Specific Size"
                                            variant="outlined"
                                            type="number"
                                            fullWidth
                                        />
                                    </TableCell>

                                    <TableCell>
                                        <TextField
                                            label="Price Change"
                                            variant="outlined"
                                            type="number"
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={addRow} variant="contained" color="primary">
                        Add Row
                    </Button>

                    <Button onClick={handleCreate} variant="contained" color="success">
                        Create
                    </Button>
                </div>
            </Paper>

            <FontGroupList refreshFontGroups={refreshFontGroups} />
        </Container>
    );
}

export default FontGroup;
