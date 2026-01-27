import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Button, Box, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useThemeStore } from '../../../store/themeStore';
import { useAuthStore } from '../../../store/authStore';
import { logoutUser } from '../../../services/AuthApiService';
import { useTranslation } from 'react-i18next';

type HeaderProps = {};

const Header: React.FC<HeaderProps> = () => {
    const { t, i18n } = useTranslation();
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

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'pl' : 'en';
        i18n.changeLanguage(newLang);
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
                    {t('app.title')}
                </Typography>

                {/* Spacer */}
                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                    <Button
                        color="inherit"
                        onClick={toggleLanguage}
                        startIcon={<LanguageIcon />}
                        sx={{ minWidth: 'auto' }}
                    >
                        {i18n.language === 'en' ? 'PL' : 'EN'}
                    </Button>

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
                                {t('nav.logout')}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                component={Link}
                                to="/login"
                            >
                                {t('nav.login')}
                            </Button>

                            <Button
                                color="inherit"
                                component={Link}
                                to="/register"
                            >
                                {t('nav.register')}
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
