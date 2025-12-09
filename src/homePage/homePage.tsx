import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import EventList from './events/EventList';
import GetEvents from '../mockData/getEventsNew';
import type { EventData } from '../types/Event';
import EventDetailsModal from './events/EventDetailsModal';

interface HomePageProps { };

const HomePage: React.FC<HomePageProps> = () => {
    const [events, setEvents] = useState<EventData[]>([]);

    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    useEffect(() => {
        // TODO: change to API call with axios
        const fetchedEvents = GetEvents();
        setEvents(fetchedEvents);
    }, []);

    const handleSelectEvent = (id: number) => {
        setSelectedEventId(id);
        console.log(`Selected Event ID: ${id}`);
    };

    const handleCloseModal = () => {
        setSelectedEventId(null);
    };

    const isModalOpen = selectedEventId !== null;
    const selectedEvent = events.find(e => e.id === selectedEventId) || null;

    return (
        <Container maxWidth="xl">
            <Typography variant="h3" component="h1" gutterBottom sx={{ pt: 4 }}>
                Upcoming Events
            </Typography>

            <EventList events={events} onSelectEvent={handleSelectEvent} />

            <EventDetailsModal
                event={selectedEvent}
                open={isModalOpen}
                onClose={handleCloseModal}
            />

        </Container>
    );
};

export default HomePage;