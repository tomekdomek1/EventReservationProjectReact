import React from 'react';
import { Box } from '@mui/material';
import UserInfo from './UserInfo';
import UserRegistrations from './UserRegistrations';

const UserProfileOverview: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <UserInfo />
            <UserRegistrations />
        </Box>
    );
};

export default UserProfileOverview;
