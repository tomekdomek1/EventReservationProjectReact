import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, CircularProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import type { EventSession } from '../../../types/Session';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { registerForSession, unregisterFromSession } from '../../../services/SessionApiService';
import { useSnackbar } from 'notistack';
import { showApiError } from '../../../services/api';

interface EventSessionCardProps {
    session: EventSession;
    isRegistered: boolean;
    onStatusChange: () => void;
}

const EventSessionCard: React.FC<EventSessionCardProps> = ({ session, isRegistered, onStatusChange }) => {
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const freeSpots = session.maxParticipants - session.currentReserved;
    const isFull = freeSpots <= 0;

    const handleAction = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            if (isRegistered) {
                await unregisterFromSession(session.id);
                enqueueSnackbar('Successfully unregistered from session', { variant: 'success' });
            } else {
                await registerForSession(session.id);
                enqueueSnackbar('Successfully registered for session', { variant: 'success' });
            }
            onStatusChange();
        } catch (error) {
            console.error(error);
            showApiError(error, isRegistered ? "Failed to unregister" : "Failed to register");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                        <Typography variant="h6" component="div">
                            {session.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1, color: 'text.secondary' }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">
                                {session.startTime.format('HH:mm')} ({session.duration} min)
                            </Typography>
                        </Box>
                        {session.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {session.description}
                            </Typography>
                        )}
                        <Box sx={{ display: 'flex', alignItems: 'center', color: isFull && !isRegistered ? 'error.main' : 'success.main' }}>
                            <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" fontWeight="bold">
                                {freeSpots} / {session.maxParticipants} free spots
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                        <Button
                            variant={isRegistered ? "outlined" : "contained"}
                            color={isRegistered ? "error" : "primary"}
                            onClick={handleAction}
                            disabled={loading || (!isRegistered && isFull)}
                            sx={{ minWidth: 100 }}
                        >
                            {loading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : isRegistered ? (
                                "Leave"
                            ) : !user ? (
                                "Sign in to join"
                            ) : isFull ? (
                                "Full"
                            ) : (
                                "Join"
                            )}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default EventSessionCard;
