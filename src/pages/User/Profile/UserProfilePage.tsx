import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import UserInfo from './UserInfo';
import UserRegistrations from './UserRegistrations';

const UserProfilePage: React.FC = () => {
    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                Profile
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <UserInfo />
                <UserRegistrations />
            </Box>
        </Container>
    );
};

export default UserProfilePage;
