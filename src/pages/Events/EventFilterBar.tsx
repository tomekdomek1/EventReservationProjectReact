import React, { useState, useEffect } from 'react';
import { Box, Button, Paper, Stack, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import dayjs, { Dayjs } from 'dayjs';

interface EventFilterBarProps {
    initialFromDate: string | null;
    initialToDate: string | null;
    initialSearch: string | null;
    onFilter: (fromDate: string | null, toDate: string | null, search: string) => void;
    onClear: () => void;
}

const EventFilterBar: React.FC<EventFilterBarProps> = ({ 
    initialFromDate, 
    initialToDate, 
    initialSearch,
    onFilter, 
    onClear 
}) => {
    const [fromDate, setFromDate] = useState<Dayjs | null>(initialFromDate ? dayjs(initialFromDate) : null);
    const [toDate, setToDate] = useState<Dayjs | null>(initialToDate ? dayjs(initialToDate) : null);
    const [search, setSearch] = useState<string>(initialSearch || '');

    useEffect(() => {
        setFromDate(initialFromDate ? dayjs(initialFromDate) : null);
        setToDate(initialToDate ? dayjs(initialToDate) : null);
        setSearch(initialSearch || '');
    }, [initialFromDate, initialToDate, initialSearch]);

    const handleFilter = () => {
        const from = fromDate ? fromDate.format('YYYY-MM-DD') : null;
        const to = toDate ? toDate.format('YYYY-MM-DD') : null;
        onFilter(from, to, search);
    };

    const handleClear = () => {
        setFromDate(null);
        setToDate(null);
        setSearch('');
        onClear();
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <TextField
                    label="Search..."
                    variant="outlined"
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                />
                <DatePicker
                    label="From Date"
                    value={fromDate}
                    onChange={(newValue) => setFromDate(newValue)}
                    slotProps={{ 
                        textField: { size: 'small', fullWidth: true },
                        actionBar: { actions: ['clear'] } 
                    }}
                />
                <DatePicker
                    label="To Date"
                    value={toDate}
                    onChange={(newValue) => setToDate(newValue)}
                    slotProps={{ 
                        textField: { size: 'small', fullWidth: true },
                        actionBar: { actions: ['clear'] }
                    }}
                />
                
                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                    <Button 
                        variant="contained" 
                        startIcon={<SearchIcon />} 
                        onClick={handleFilter}
                        fullWidth
                        sx={{ minWidth: '100px' }}
                    >
                        Filter
                    </Button>
                    <Button 
                        variant="outlined" 
                        startIcon={<ClearIcon />} 
                        onClick={handleClear}
                        color="secondary"
                        fullWidth
                        sx={{ minWidth: '100px' }}
                    >
                        Clear
                    </Button>
                </Box>
            </Stack>
        </Paper>
    );
};

export default EventFilterBar;
