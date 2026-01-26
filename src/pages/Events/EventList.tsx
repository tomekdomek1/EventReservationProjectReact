import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import EventCard from './EventCard';
import type { EventData } from '../../types/Event';

interface EventListProps {
    events: EventData[];
    onSelectEvent: (id: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onSelectEvent }) => {
    if (events.length === 0) {
        return (
            <Box sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No events found matching your criteria.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ py: 4 }}>
            <Grid container spacing={3}>
                {events.map((event) => (
                    <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                        <EventCard event={event} onClick={onSelectEvent} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default EventList;