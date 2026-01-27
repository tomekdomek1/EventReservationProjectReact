import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

type NotFoundPageProps = {};

const NotFoundPage: React.FC<NotFoundPageProps> = () => {
    const { t } = useTranslation();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '70vh',
                    textAlign: 'center',
                    py: 8,
                }}
            >
                <Typography variant="h1" component="h1" sx={{ fontSize: '6rem', color: 'error.main', mb: 2 }}>
                    404
                </Typography>

                <Typography variant="h4" component="h2" gutterBottom>
                    {t('not_found.title')}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    {t('not_found.message')}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/"
                >
                    {t('not_found.button')}
                </Button>
            </Box>
        </Container>
    );
};

export default NotFoundPage;