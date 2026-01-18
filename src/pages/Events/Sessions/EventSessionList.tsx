import React, { useMemo } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import useSWR from 'swr';
import { fetcher, fetchUserRegistrations } from '../../../services/SessionApiService';
import type { EventSession } from '../../../types/Session';
import type { PaginatedResponse } from '../../../types/Pagination';
import type { RegistrationData } from '../../../types/Registration';
import EventSessionCard from './EventSessionCard';
import { useAuthStore } from '../../../store/authStore';

interface EventSessionListProps {
    eventId: number;
}

const EventSessionList: React.FC<EventSessionListProps> = ({ eventId }) => {
    const user = useAuthStore((state) => state.user);

    // Fetch sessions for the event
    const {
        data: sessionsData,
        error: sessionsError,
        isLoading: sessionsLoading,
        mutate: mutateSessions
    } = useSWR<PaginatedResponse<EventSession>>(
        `/event/${eventId}/sessions?page=1&pageSize=100`,
        fetcher
    );

    // Fetch user registrations if logged in
    const {
        data: registrationsData,
        mutate: mutateRegistrations
    } = useSWR<PaginatedResponse<RegistrationData>>(
        user ? `/registrations?page=1&pageSize=100` : null,
        fetchUserRegistrations
    );

    const userRegisteredSessionIds = useMemo(() => {
        if (!registrationsData?.items) return new Set<number>();
        return new Set(registrationsData.items.map(r => r.sessionId));
    }, [registrationsData]);

    const handleStatusChange = () => {
        // Refresh both lists to update "free spots" and "isRegistered" button state
        mutateSessions();
        mutateRegistrations();
    };

    if (sessionsLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (sessionsError) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                Failed to load sessions.
            </Alert>
        );
    }

    if (!sessionsData?.items || sessionsData.items.length === 0) {
        return (
            <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                No sessions planned for this event.
            </Typography>
        );
    }

    return (
        <Box sx={{ mt: 2 }}>
            {sessionsData.items.map((session) => (
                <EventSessionCard
                    key={session.id}
                    session={session}
                    isRegistered={userRegisteredSessionIds.has(session.id)}
                    onStatusChange={handleStatusChange}
                />
            ))}
        </Box>
    );
};

export default EventSessionList;
