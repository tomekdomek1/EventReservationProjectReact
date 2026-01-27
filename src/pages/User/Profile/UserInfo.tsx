import React from 'react';
import { Typography, Box, Grid, Divider, Skeleton, Paper } from '@mui/material';
import useSWR from 'swr';
import { getUserProfile } from '../../../services/UserApiService';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import { useTranslation } from 'react-i18next';

const UserInfo: React.FC = () => {
    const { t } = useTranslation();
    const { data: profile, error, isLoading } = useSWR('user-profile', getUserProfile);

    if (isLoading) return <Skeleton variant="rectangular" height={200} />;
    if (error) return <Typography color="error">{t('profile.info.load_fail')}</Typography>;

    return (
        <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PersonIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                    <Typography variant="h6" fontWeight="600">{t('profile.info.title')}</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">{t('profile.info.email')}</Typography>
                        </Box>
                        <Typography variant="body1">{profile?.email}</Typography>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">{t('profile.info.full_name')}</Typography>
                        </Box>
                        <Typography variant="body1">{profile?.firstName} {profile?.lastName}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">{t('profile.info.phone')}</Typography>
                        </Box>
                        <Typography variant="body1">{profile?.phone}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PublicIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">{t('profile.info.country')}</Typography>
                        </Box>
                        <Typography variant="body1">{profile?.country}</Typography>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    )
};

export default UserInfo;
