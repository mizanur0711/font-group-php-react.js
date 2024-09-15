import React from 'react';
import { DropzoneArea } from 'react-mui-dropzone';
import { Grid, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import axios from 'axios';

function FontUpload({ onUpload }) {
    const handleChange = (files) => {
        if (files.length === 0) return;

        const formData = new FormData();
        formData.append('font', files[0]);

        axios.post('http://localhost:8000/php-backend/upload_font.php', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {

                if (response.data.status) {
                    if (onUpload) onUpload();
                } else {
                    console.error('Upload failed:', response.data.message);
                }
            })
            .catch(error => {
                console.error('Upload failed:', error);
            });
    };


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
                    filesLimit={1}
                    showPreviewsInDropzone={false}
                />
            </Grid>
        </Grid>
    );
}

export default FontUpload;
