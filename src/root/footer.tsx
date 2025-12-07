import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer: React.FC = () => (
    <Box
        component="footer"
        sx={{
            py: 3,
            px: 2,
            backgroundColor: (theme) =>
                theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        }}
    >
        <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
                © 2025 My app.
            </Typography>
        </Container>
    </Box>
);

export default Footer;