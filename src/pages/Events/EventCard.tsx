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
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea
                onClick={handleClick}
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'stretch'
                }}
            >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography
                        variant="h5"
                        component="div"
                        gutterBottom
                        sx={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                            minHeight: '3.2em', 
                        }}
                    >
                        {event.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 2 }}>
                        {event.description}
                    </Typography>

                    <Box sx={{ marginTop: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarTodayIcon sx={{ mr: 1, fontSize: 18 }} color="primary" />
                            <Typography variant="body2">
                                {event.startTime.format('MMM DD, YYYY [at] HH:mm')}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <LocationOnIcon sx={{ mr: 1, fontSize: 18, mt: 0.3 }} color="action" />
                            <Typography
                                variant="body2"
                                sx={{
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2, 
                                    minHeight: '3em', 
                                }}
                            >
                                {event.location}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default EventCard;