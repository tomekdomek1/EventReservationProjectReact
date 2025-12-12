import React from 'react';
import { Card, CardContent, Typography, CardActionArea, Box } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { EventData } from '../../types/Event';

interface EventCardProps {
    event: EventData;
    onClick: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
    const handleClick = () => {
        onClick(event.id);
    };

    return (
        <Card sx={{ height: '100%' }}>
            <CardActionArea onClick={handleClick}>
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        {event.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
                        {event.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} color="primary" />
                        <Typography variant="body2">
                            {event.startTime.format('MMM DD, YYYY [at] HH:mm')}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ mr: 1, fontSize: 18 }} color="action" />
                        <Typography variant="body2">
                            {event.location}
                        </Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default EventCard;