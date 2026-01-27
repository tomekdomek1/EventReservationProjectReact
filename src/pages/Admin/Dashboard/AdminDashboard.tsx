import { type JSX, useState, useMemo } from "react";
import {
    Box,
    Paper,
    Typography,
    Grid,
    CircularProgress,
    Card,
    CardContent,
    ToggleButtonGroup,
    ToggleButton,
    useTheme,
    alpha,
    Container,
} from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import useSWR from 'swr';
import { getStatistics } from "../../../services/StatisticsApiService";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

type DateRangeType = '7d' | '30d' | '90d' | '365d';

const AdminDashboard = (): JSX.Element => {
    const { t } = useTranslation();
    const theme = useTheme();
    const [dateRange, setDateRange] = useState<DateRangeType>('30d');

    const dateParams = useMemo(() => {
        const endDate = dayjs().format('YYYY-MM-DD');
        let startDate: string;
        
        switch (dateRange) {
            case '7d':
                startDate = dayjs().subtract(7, 'day').format('YYYY-MM-DD');
                break;
            case '30d':
                startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
                break;
            case '90d':
                startDate = dayjs().subtract(90, 'day').format('YYYY-MM-DD');
                break;
            case '365d':
                startDate = dayjs().subtract(365, 'day').format('YYYY-MM-DD');
                break;
            default:
                startDate = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
        }
        
        return { startDate, endDate };
    }, [dateRange]);

    const { data: statistics, isLoading, error } = useSWR(
        ['statistics', dateParams.startDate, dateParams.endDate],
        () => getStatistics(dateParams.startDate, dateParams.endDate)
    );

    const handleDateRangeChange = (_: React.MouseEvent<HTMLElement>, newRange: DateRangeType | null) => {
        if (newRange) {
            setDateRange(newRange);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{t('admin.dashboard.load_fail')}</Typography>
            </Box>
        );
    }

    const summary = statistics?.summary;
    const dailyData = statistics?.dailyData || [];

    // Prepare chart data
    const chartDates = dailyData.map(d => dayjs(d.date).format('MMM DD'));
    const eventsData = dailyData.map(d => d.events);
    const sessionsData = dailyData.map(d => d.sessions);
    const registrationsData = dailyData.map(d => d.registrations);

    // Pie chart data for distribution
    const pieData = [
        { id: 0, value: summary?.totalEvents || 0, label: t('admin.dashboard.total_events'), color: theme.palette.primary.main },
        { id: 1, value: summary?.totalSessions || 0, label: t('admin.dashboard.total_sessions'), color: theme.palette.secondary.main },
        { id: 2, value: summary?.totalRegistrations || 0, label: t('admin.dashboard.total_registrations'), color: theme.palette.success.main },
    ];

    const summaryCards = [
        {
            title: t('admin.dashboard.total_users'),
            value: summary?.totalUsers || 0,
            icon: <PeopleIcon sx={{ fontSize: 32 }} />,
            color: theme.palette.primary.main,
            bgColor: alpha(theme.palette.primary.main, 0.1),
        },
        {
            title: t('admin.dashboard.total_events'),
            value: summary?.totalEvents || 0,
            icon: <EventIcon sx={{ fontSize: 32 }} />,
            color: theme.palette.secondary.main,
            bgColor: alpha(theme.palette.secondary.main, 0.1),
        },
        {
            title: t('admin.dashboard.total_sessions'),
            value: summary?.totalSessions || 0,
            icon: <ScheduleIcon sx={{ fontSize: 32 }} />,
            color: theme.palette.warning.main,
            bgColor: alpha(theme.palette.warning.main, 0.1),
        },
        {
            title: t('admin.dashboard.total_registrations'),
            value: summary?.totalRegistrations || 0,
            icon: <ConfirmationNumberIcon sx={{ fontSize: 32 }} />,
            color: theme.palette.success.main,
            bgColor: alpha(theme.palette.success.main, 0.1),
        },
    ];

    const rangeCards = [
        {
            title: t('admin.dashboard.events_in_range'),
            value: summary?.eventsInRange || 0,
            icon: <CalendarTodayIcon sx={{ fontSize: 26 }} />,
            color: theme.palette.info.main,
        },
        {
            title: t('admin.dashboard.sessions_in_range'),
            value: summary?.sessionsInRange || 0,
            icon: <TrendingUpIcon sx={{ fontSize: 26 }} />,
            color: theme.palette.warning.main,
        },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {t('admin.dashboard.title')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('admin.dashboard.subtitle')}
                    </Typography>
                </Box>
                
                <ToggleButtonGroup
                    value={dateRange}
                    exclusive
                    onChange={handleDateRangeChange}
                    size="small"
                >
                    <ToggleButton value="7d">{t('admin.dashboard.range_7d')}</ToggleButton>
                    <ToggleButton value="30d">{t('admin.dashboard.range_30d')}</ToggleButton>
                    <ToggleButton value="90d">{t('admin.dashboard.range_90d')}</ToggleButton>
                    <ToggleButton value="365d">{t('admin.dashboard.range_365d')}</ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {summaryCards.map((card) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
                        <Card 
                            elevation={0} 
                            sx={{ 
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                height: '100%'
                            }}
                        >
                            <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" gutterBottom>
                                            {card.title}
                                        </Typography>
                                        <Typography variant="h5" fontWeight="bold">
                                            {card.value.toLocaleString()}
                                        </Typography>
                                    </Box>
                                    <Box 
                                        sx={{ 
                                            p: 1, 
                                            borderRadius: 1.5, 
                                            backgroundColor: card.bgColor,
                                            color: card.color
                                        }}
                                    >
                                        {card.icon}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Range Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {rangeCards.map((card) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={card.title}>
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                p: 2, 
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5
                            }}
                        >
                            <Box sx={{ color: card.color }}>
                                {card.icon}
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">
                                    {card.title}
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    {card.value.toLocaleString()}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {/* Line Chart - Activity Over Time */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            height: '100%'
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                            {t('admin.dashboard.activity_over_time')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                            {t('admin.dashboard.activity_subtitle')}
                        </Typography>
                        
                        {dailyData.length > 0 ? (
                            <LineChart
                                height={280}
                                series={[
                                    { 
                                        data: eventsData, 
                                        label: t('admin.dashboard.total_events'),
                                        color: theme.palette.primary.main,
                                        curve: 'linear'
                                    },
                                    { 
                                        data: sessionsData, 
                                        label: t('admin.dashboard.total_sessions'),
                                        color: theme.palette.secondary.main,
                                        curve: 'linear'
                                    },
                                    { 
                                        data: registrationsData, 
                                        label: t('admin.dashboard.total_registrations'),
                                        color: theme.palette.success.main,
                                        curve: 'linear'
                                    },
                                ]}
                                xAxis={[{ 
                                    scaleType: 'point', 
                                    data: chartDates,
                                    tickLabelStyle: { fontSize: 11 }
                                }]}
                            />
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 280 }}>
                                <Typography color="text.secondary">{t('admin.dashboard.no_data')}</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                {/* Pie Chart - Distribution */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            height: '100%'
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                            {t('admin.dashboard.distribution')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                            {t('admin.dashboard.distribution_subtitle')}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <PieChart
                                series={[{
                                        data: pieData,
                                        innerRadius: 50,
                                        outerRadius: 100,
                                        paddingAngle: 2,
                                        cornerRadius: 4,
                                        highlightScope: { fade: 'global', highlight: 'item' },
                                    },
                                ]}
                                height={280}
                            />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Bar Chart - Comparison */}
            <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            border: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                            {t('admin.dashboard.daily_registrations')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
                            {t('admin.dashboard.daily_registrations_subtitle')}
                        </Typography>
                        
                        {dailyData.length > 0 ? (
                            <BarChart
                                height={240}
                                series={[
                                    { 
                                        data: registrationsData, 
                                        label: t('admin.dashboard.total_registrations'),
                                        color: theme.palette.success.main 
                                    },
                                ]}
                                xAxis={[{ 
                                    scaleType: 'band', 
                                    data: chartDates,
                                    tickLabelStyle: { fontSize: 11 }
                                }]}
                            />
                        ) : (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 240 }}>
                                <Typography color="text.secondary">{t('admin.dashboard.no_data')}</Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboard;
