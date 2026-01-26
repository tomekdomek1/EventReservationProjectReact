import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Box,
    Typography,
    Avatar,
    Pagination,
    CircularProgress,
    Alert,
    Chip,
    Divider
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import useSWR from 'swr';
import { getSessionParticipants } from '../../../services/SessionApiService';
import type { SessionParticipant } from '../../../types/Registration';
import type { PaginatedResponse } from '../../../types/Pagination';

interface SessionParticipantsDialogProps {
    sessionId: number;
    sessionName: string;
    currentReserved: number;
}

export default function SessionParticipantsDialog({ sessionId, sessionName, currentReserved }: SessionParticipantsDialogProps) {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const { data, error, isLoading } = useSWR<PaginatedResponse<SessionParticipant>>(
        open ? `session-${sessionId}-participants-${page}-${pageSize}` : null,
        () => getSessionParticipants(sessionId, page, pageSize),
        { keepPreviousData: true }
    );

    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPage(1);
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const getStatusColor = (status: string | number) => {
        const statusStr = String(status).toLowerCase();
        switch (statusStr) {
            case 'registered':
            case '1':
                return 'success';
            case 'cancelled':
            case '2':
                return 'error';
            case 'pending':
            case '0':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string | number) => {
        if (typeof status === 'string') return status;
        switch (status) {
            case 0: return 'Pending';
            case 1: return 'Registered';
            case 2: return 'Cancelled';
            default: return 'Unknown';
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    return (
        <>
            <IconButton onClick={handleOpen} title="View participants">
                <PeopleIcon />
            </IconButton>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" component="span">
                            Participants
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {sessionName} ({currentReserved} registered)
                        </Typography>
                    </Box>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ minHeight: 300 }}>
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Failed to load participants.
                        </Alert>
                    )}

                    {!isLoading && !error && data?.items.length === 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                            <Typography color="text.secondary">No participants registered for this session.</Typography>
                        </Box>
                    )}

                    {!isLoading && !error && data?.items && data.items.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {data.items.map((participant) => (
                                <Box
                                    key={participant.registrationId}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        p: 1.5,
                                        borderBottom: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ width: 36, height: 36, fontSize: '0.875rem' }}>
                                            {getInitials(participant.firstName, participant.lastName)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="medium">
                                                {participant.firstName} {participant.lastName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {participant.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Chip
                                        label={getStatusLabel(participant.registrationStatus)}
                                        size="small"
                                        color={getStatusColor(participant.registrationStatus)}
                                        variant="outlined"
                                    />
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', pb: 2 }}>
                    <Pagination
                        count={data?.pageCount}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            </Dialog>
        </>
    );
}
