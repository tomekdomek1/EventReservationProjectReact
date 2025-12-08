import React from 'react';
import { Grid, Box } from '@mui/material';
import EventCard from './EventCard';
import type { Event } from '../../types/Event';

interface EventListProps {
    events: Event[];
    onSelectEvent: (id: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onSelectEvent }) => {
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