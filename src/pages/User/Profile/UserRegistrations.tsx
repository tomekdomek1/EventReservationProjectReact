import React from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import useSWR from 'swr';
import { fetchUserRegistrations } from '../../../services/SessionApiService';
import type { PaginatedResponse } from '../../../types/Pagination';
import type { RegistrationData } from '../../../types/Registration';
import EventSessionCard from '../../Events/Sessions/EventSessionCard';
import EventIcon from '@mui/icons-material/Event';

const UserRegistrations: React.FC = () => {
    const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<RegistrationData>>(
        '/registrations?page=1&pageSize=100',
        fetchUserRegistrations
    );

    if (isLoading) return <CircularProgress />;
    if (error) return <Alert severity="error">Failed to load registrations.</Alert>;

    const registrations = data?.items || [];

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">My Registered Sessions</Typography>
            </Box>
            
            {registrations.length === 0 ? (
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    You haven't registered for any sessions yet.
                </Typography>
            ) : (
                registrations.map((reg) => (
                    <EventSessionCard
                        key={reg.id}
                        session={reg.session}
                        isRegistered={true}
                        onStatusChange={() => mutate()} // Refresh list on unregister
                    />
                ))
            )}
        </Box>
    );
};

export default UserRegistrations;
