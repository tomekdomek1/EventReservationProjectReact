import { type JSX } from "react";
import { Box, Button, Paper, Typography, Divider } from "@mui/material";
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { ChangePasswordSchema } from "../../../types/AuthFormModel";
import { changePassword } from "../../../services/UserApiService";
import { showApiError } from "../../../services/api";
import LockIcon from '@mui/icons-material/Lock';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useTranslation } from "react-i18next";

export const ChangePasswordPage = (): JSX.Element => {
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();

    const formContext = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        },
        resolver: zodResolver(ChangePasswordSchema)
    });

    const onSubmit = async (data: any) => {
        try {
            await changePassword({ 
                oldPassword: data.oldPassword, 
                newPassword: data.newPassword,
                confirmNewPassword: data.confirmNewPassword
            });
            enqueueSnackbar(t('profile.password.success'), { variant: "success" });
            formContext.reset();
        } catch (error) {
            console.error(error);
            showApiError(error, t('profile.password.fail'));
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LockIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                    <Typography variant="h6" fontWeight="600">{t('profile.password.title')}</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <FormContainer 
                    formContext={formContext} 
                    onSuccess={onSubmit}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 400, mx: 'auto' }}>
                        <TextFieldElement
                            name="oldPassword"
                            label={t('profile.password.current')}
                            type="password"
                            required
                            fullWidth
                        />

                        <TextFieldElement
                            name="newPassword"
                            label={t('profile.password.new')}
                            type="password"
                            required
                            fullWidth
                        />

                        <TextFieldElement
                            name="confirmNewPassword"
                            label={t('profile.password.confirm')}
                            type="password"
                            required
                            fullWidth
                        />

                        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                size="large"
                                startIcon={<LockResetIcon />}
                                sx={{ 
                                    px: 4, 
                                    py: 1.5, 
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                {t('profile.password.submit')}
                            </Button>
                        </Box>
                    </Box>
                </FormContainer>
            </Paper>
        </Box>
    );
};

export default ChangePasswordPage;
