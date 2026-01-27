import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                backgroundColor: (theme) => theme.palette.background.paper,
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    {t('footer.copyright')}
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;