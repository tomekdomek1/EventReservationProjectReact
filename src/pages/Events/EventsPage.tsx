import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert, Pagination, Box } from '@mui/material';
import EventList from './EventList';
import EventDetailsModal from './EventDetailsModal';
import useSWR from 'swr';
import { fetcher } from '../../services/api';
import type { EventData, PaginatedResponse } from '../../types/Event';

interface HomePageProps { };

const EventsPage: React.FC<HomePageProps> = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '8', 10);

    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    const { data: eventResponse, error, isLoading } = useSWR<PaginatedResponse<EventData>>(
        `/events?page=${page}&pageSize=${pageSize}`,
        fetcher,
        {
            keepPreviousData: true,
        }
    );

    const handleSelectEvent = (id: number) => {
        setSelectedEventId(id);
        console.log(`Selected Event ID: ${id}`);
    };

    const handleCloseModal = () => {
        setSelectedEventId(null);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setSearchParams({
            page: value.toString(),
            pageSize: pageSize.toString()
        });
        window.scrollTo(0, 0);
    }

    const selectedEvent = eventResponse?.items.find(e => e.id === selectedEventId) || null;

    return (
        <Container>
            <Typography variant="h3" gutterBottom sx={{ pt: 4 }}>
                Upcoming Events
            </Typography>

            {error && (
                <Alert severity="error">Failed to load events. Please try again later.</Alert>
            )}

            <Box sx={{ minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                {eventResponse ? (
                    <>
                        <EventList events={eventResponse.items} onSelectEvent={handleSelectEvent} />
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', pb: 4 }}>
                            <Pagination
                                count={eventResponse.pageCount}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    </>
                ) : isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                        <CircularProgress />
                    </Box>
                ) : null}
            </Box>

            <EventDetailsModal
                event={selectedEvent}
                open={Boolean(selectedEvent)}
                onClose={handleCloseModal}
            />

        </Container>
    );
};

export default EventsPage;