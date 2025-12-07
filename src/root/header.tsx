import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Box, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
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