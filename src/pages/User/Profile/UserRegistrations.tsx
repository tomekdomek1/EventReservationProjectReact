import React, { useState, useMemo } from 'react';
import { 
    Box, 
    Typography, 
    Alert, 
    CircularProgress, 
    FormControlLabel, 
    Switch, 
    Collapse,
    IconButton,
    Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FilterListIcon from '@mui/icons-material/FilterList';
import useSWR from 'swr';
import  { Dayjs } from 'dayjs';
import { fetchUserRegistrations } from '../../../services/SessionApiService';
import type { PaginatedResponse } from '../../../types/Pagination';
import type { RegistrationData } from '../../../types/Registration';
import EventSessionCard from '../../Events/Sessions/EventSessionCard';
import EventIcon from '@mui/icons-material/Event';

const UserRegistrations: React.FC = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [upcomingOnly, setUpcomingOnly] = useState(true);
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);

    const queryUrl = useMemo(() => {
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('pageSize', '100');
        
        if (!upcomingOnly) {
            params.append('upcomingOnly', 'false');
        }
        
        if (startDate) {
            params.append('startDate', startDate.format('YYYY-MM-DD'));
        }
        
        if (endDate) {
            params.append('endDate', endDate.format('YYYY-MM-DD'));
        }
        
        return `/registrations?${params.toString()}`;
    }, [upcomingOnly, startDate, endDate]);

    const { data, error, isLoading, isValidating, mutate } = useSWR<PaginatedResponse<RegistrationData>>(
        queryUrl,
        fetchUserRegistrations,
        { keepPreviousData: true }
    );

    const registrations = data?.items || [];

    // Show full loading only on first load (no data yet)
    const showFullLoading = isLoading && !data;

    if (error) return <Alert severity="error">Failed to load registrations.</Alert>;

    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">My Registered Sessions</Typography>
                </Box>
                <IconButton onClick={() => setShowFilters(!showFilters)} color={showFilters ? 'primary' : 'default'}>
                    <FilterListIcon />
                </IconButton>
            </Box>

            <Collapse in={showFilters}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={upcomingOnly}
                                    onChange={(e) => setUpcomingOnly(e.target.checked)}
                                />
                            }
                            label="Upcoming only"
                        />
                        <DatePicker
                            label="Start date"
                            value={startDate}
                            onChange={(value) => setStartDate(value)}
                            slotProps={{ 
                                textField: { size: 'small' },
                                field: { clearable: true }
                            }}
                        />
                        <DatePicker
                            label="End date"
                            value={endDate}
                            onChange={(value) => setEndDate(value)}
                            slotProps={{ 
                                textField: { size: 'small' },
                                field: { clearable: true }
                            }}
                        />
                    </Box>
                </Paper>
            </Collapse>

            {showFullLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            ) : registrations.length === 0 ? (
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    You haven't registered for any sessions yet.
                </Typography>
            ) : (
                <Box sx={{ opacity: isValidating ? 0.6 : 1, transition: 'opacity 0.2s' }}>
                    {registrations.map((reg) => (
                        <EventSessionCard
                            key={reg.id}
                            session={reg.session}
                            isRegistered={true}
                            onStatusChange={() => mutate()}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default UserRegistrations;
