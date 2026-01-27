import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    IconButton,
    Box,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import type { EventData } from '../../types/Event';
import EventSessionList from './Sessions/EventSessionList';
import { useTranslation } from 'react-i18next';

interface EventDetailsModalProps {
    event: EventData | null;
    open: boolean;
    onClose: () => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ event, open, onClose }) => {
    const { t } = useTranslation();

    if (!event) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {event.name}
                    <IconButton onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2 }}>
                    {t('events.details.title')}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    {event.description}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    <strong>{t('events.details.location')}:</strong> {event.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>{t('events.details.start_time')}:</strong> {event.startTime.format('MMMM DD, YYYY [at] HH:mm')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    <strong>{t('events.details.end_time')}:</strong> {event.endTime.format('MMMM DD, YYYY [at] HH:mm')}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 2 }}>
                    {t('events.details.coordinator_info')}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PersonIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                        <strong>{t('events.details.name')}:</strong> {event.coordinatorName} {event.coordinatorSurname}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhoneIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                        <strong>{t('events.details.phone')}:</strong> {event.coordinatorPhone}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                        <strong>{t('events.details.email')}:</strong> {event.eventEmail}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3, mb: 2 }}>
                    {t('events.details.sessions')}
                </Typography>
                
                <EventSessionList eventId={event.id} />

            </DialogContent>
        </Dialog>
    );
};

export default EventDetailsModal;