import React from 'react';
import { Container, Grid, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider, Skeleton } from '@mui/material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import useSWR from 'swr';
import { getUserProfile } from '../../../services/UserApiService';

const UserProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data: profile, isLoading } = useSWR('user-profile', getUserProfile);
    
    const menuItems = [
        { text: 'User Info', icon: <PersonIcon />, path: '/profile' },
        { text: 'Edit Data', icon: <EditIcon />, path: '/profile/edit' },
        { text: 'Change Password', icon: <LockIcon />, path: '/profile/password' },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {isLoading ? (
                                <Skeleton width="60%" />
                            ) : (
                                <Typography variant="h6" align="center" fontWeight="bold">
                                    {profile?.firstName} {profile?.lastName}
                                </Typography>
                            )}
                             {isLoading ? (
                                <Skeleton width="80%" />
                            ) : (
                                <Typography variant="body2" color="text.secondary" align="center">
                                    {profile?.email}
                                </Typography>
                             )}
                        </Box>
                        <Divider />
                        <List component="nav" sx={{ p: 1 }}>
                            {menuItems.map((item) => (
                                <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                                    <ListItemButton 
                                        selected={location.pathname === item.path || (item.path !== '/profile' && location.pathname.startsWith(item.path))}
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            borderRadius: 2,
                                            '&.Mui-selected': {
                                                backgroundColor: 'primary.main',
                                                color: 'primary.contrastText',
                                                '& .MuiListItemIcon-root': {
                                                    color: 'primary.contrastText',
                                                },
                                                '&:hover': {
                                                    backgroundColor: 'primary.dark',
                                                },
                                            },
                                        }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'inherit' : 'text.secondary' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={item.text} 
                                            primaryTypographyProps={{ 
                                                fontWeight: 500
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 9 }}>
                    <Outlet />
                </Grid>
            </Grid>
        </Container>
    );
};

export default UserProfilePage;
