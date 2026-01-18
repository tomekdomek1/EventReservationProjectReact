import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Box, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useThemeStore } from '../../../store/themeStore';
import { useAuthStore } from '../../../store/authStore';
import { logoutUser } from '../../../services/AuthApiService';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
    const navigate = useNavigate();
    const mode = useThemeStore((state) => state.mode);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Logout API failed", error);
        } finally {
            logout();
            navigate('/login');
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="home"
                    component={Link}
                    to="/"
                    sx={{ mr: 2 }}
                >
                    <HomeIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                >
                    EventReservationApp
                </Typography>

                {/* Spacer */}
                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                    <IconButton
                        color="inherit"
                        onClick={toggleTheme}
                        aria-label="toggle light/dark mode"
                    >
                        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    {user ? (
                        <>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/profile"
                                sx={{ 
                                    textTransform: 'none', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    ml: 2, 
                                    mr: 2,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)'
                                    }
                                }}
                            >
                                <AccountCircleIcon sx={{ mr: 1 }} />
                                <Typography variant="subtitle1">
                                    {user.email}
                                </Typography>
                            </Button>
                            <Button
                                color="inherit"
                                variant="outlined"
                                onClick={handleLogout}
                                size="small"
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                            >
                                Log in
                            </Button>

                            <Button
                                color="inherit"
                                component={Link}
                                to="/register"
                            >
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
