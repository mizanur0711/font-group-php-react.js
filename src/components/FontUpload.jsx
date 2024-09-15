import React from 'react';
import { DropzoneArea } from 'react-mui-dropzone';
import { Grid, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'; // Import a custom icon
import axios from 'axios';

function FontUpload() {
    const handleChange = (files) => {
        if (files.length === 0) return; // No files selected

        const formData = new FormData();
        formData.append('font', files[0]);

        axios.post('http://localhost:8000/php-backend/upload_font.php', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                console.log('Upload successful!');
            })
            .catch(error => console.error('Upload failed:', error));
    };
    //change text color and icon color
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <DropzoneArea
                    onChange={handleChange}
                    acceptedFiles={['.ttf']}
                    Icon={CloudUploadOutlinedIcon}
                    dropzoneText={
                        <div style={{ textAlign: 'center' }}>
                            <Typography variant="body1" component="span">
                                <strong>Click to upload</strong> or drag and drop<br />
                                Only TTF File Allowed
                            </Typography>
                        </div>
                    }
                    filesLimit={1} // Optional: limit the number of files
                    showPreviewsInDropzone={false} // Hide preview of files in the dropzone
                />
            </Grid>
        </Grid>
    );
}

export default FontUpload;
