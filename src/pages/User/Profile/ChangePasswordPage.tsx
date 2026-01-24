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

export const ChangePasswordPage = (): JSX.Element => {
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
            enqueueSnackbar("Password changed successfully!", { variant: "success" });
            formContext.reset();
        } catch (error) {
            console.error(error);
            showApiError(error, "Failed to change password");
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LockIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                    <Typography variant="h6" fontWeight="600">Change Password</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <FormContainer 
                    formContext={formContext} 
                    onSuccess={onSubmit}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 400, mx: 'auto' }}>
                        <TextFieldElement
                            name="oldPassword"
                            label="Current Password"
                            type="password"
                            required
                            fullWidth
                        />

                        <TextFieldElement
                            name="newPassword"
                            label="New Password"
                            type="password"
                            required
                            fullWidth
                        />

                        <TextFieldElement
                            name="confirmNewPassword"
                            label="Confirm New Password"
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
                                Change Password
                            </Button>
                        </Box>
                    </Box>
                </FormContainer>
            </Paper>
        </Box>
    );
};

export default ChangePasswordPage;
