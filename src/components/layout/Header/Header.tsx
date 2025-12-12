import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Box, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeStore } from '../../../store/themeStore';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {

    const mode = useThemeStore((state) => state.mode);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

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

                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <IconButton
                        color="inherit"
                        onClick={toggleTheme}
                        aria-label="toggle light/dark mode"
                        sx={{ mr: 1 }}
                    >
                        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

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
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;