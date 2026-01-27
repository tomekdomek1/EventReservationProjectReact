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
import { useTranslation } from 'react-i18next';

interface EventSessionCardProps {
    session: EventSession;
    isRegistered: boolean;
    onStatusChange: () => void;
}

const EventSessionCard: React.FC<EventSessionCardProps> = ({ session, isRegistered, onStatusChange }) => {
    const { t } = useTranslation();
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
                enqueueSnackbar(t('sessions.success_leave'), { variant: 'success' });
            } else {
                await registerForSession(session.id);
                enqueueSnackbar(t('sessions.success_join'), { variant: 'success' });
            }
            onStatusChange();
        } catch (error) {
            console.error(error);
            showApiError(error, isRegistered ? t('sessions.fail_leave') : t('sessions.fail_join'));
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
                                {session.startTime.format('HH:mm')} ({t('sessions.duration_min', { minutes: session.duration })})
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
                                {t('sessions.free_spots', { count: freeSpots, total: session.maxParticipants })}
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
                                t('sessions.leave')
                            ) : !user ? (
                                t('sessions.sign_in_to_join')
                            ) : isFull ? (
                                t('sessions.full')
                            ) : (
                                t('sessions.join')
                            )}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default EventSessionCard;
