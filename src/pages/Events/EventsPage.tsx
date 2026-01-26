import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Alert, Pagination, Box } from '@mui/material';
import EventList from './EventList';
import EventDetailsModal from './EventDetailsModal';
import EventFilterBar from './EventFilterBar';
import useSWR from 'swr';
import { fetcher } from '../../services/EventApiService';
import type { EventData } from '../../types/Event';
import type { PaginatedResponse } from '../../types/Pagination';
import dayjs from 'dayjs';

interface HomePageProps { };

const EventsPage: React.FC<HomePageProps> = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '8', 10);
    const fromDateParam = searchParams.get('fromDate');
    const toDateParam = searchParams.get('toDate');

    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    const swrKey = useMemo(() => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('pageSize', pageSize.toString());

        const effectiveFromDate = fromDateParam || dayjs().format('YYYY-MM-DD');
        params.append('fromDate', effectiveFromDate);

        if (toDateParam) {
            params.append('toDate', toDateParam);
        }

        return `/events/filter?${params.toString()}`;
    }, [page, pageSize, fromDateParam, toDateParam]);

    const { data: eventResponse, error, isLoading } = useSWR<PaginatedResponse<EventData>>(
        swrKey,
        fetcher,
        {
            keepPreviousData: true,
        }
    );

    const handleFilter = (newFrom: string | null, newTo: string | null) => {
        setSearchParams(prev => {
            prev.set('page', '1');

            if (newFrom) {
                prev.set('fromDate', newFrom);
            } else {
                prev.set('fromDate', dayjs().format('YYYY-MM-DD'));
            }

            if (newTo) {
                prev.set('toDate', newTo);
            } else {
                prev.delete('toDate');
            }

            return prev;
        });
    };

    const handleClearFilter = () => {
        setSearchParams(prev => {
            prev.set('page', '1');
            prev.delete('fromDate');
            prev.delete('toDate');
            return prev;
        });
    };

    const handleSelectEvent = (id: number) => {
        setSelectedEventId(id);
    };

    const handleCloseModal = () => {
        setSelectedEventId(null);
    };

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
        setSearchParams(prev => {
            prev.set('page', value.toString());
            return prev;
        });
        // window.scrollTo(0, 0);
    }

    const selectedEvent = eventResponse?.items.find(e => e.id === selectedEventId) || null;

    return (
        <Container>
            <Typography variant="h3" gutterBottom sx={{ pt: 4 }}>
                Upcoming Events
            </Typography>

            <EventFilterBar
                initialFromDate={fromDateParam || dayjs().format('YYYY-MM-DD')}
                initialToDate={toDateParam}
                onFilter={handleFilter}
                onClear={handleClearFilter}
            />

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
