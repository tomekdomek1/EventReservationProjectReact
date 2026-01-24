import { type JSX, useEffect } from "react";
import { Box, Paper, Typography, Button, Container, CircularProgress, Grid, Divider } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import useSWR from 'swr';
import { UpdateProfileSchema } from "../../../types/AuthFormModel";
import { getUserProfile, updateUserProfile } from "../../../services/UserApiService";
import { showApiError } from "../../../services/api";
import type { UserProfile } from "../../../types/User";

export const EditProfilePage = (): JSX.Element => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    // Fetch current user data to populate the form
    const { data: profile, isLoading, error } = useSWR('user-profile', getUserProfile);

    const formContext = useForm<UserProfile>({
        defaultValues: {
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
            country: ""
        },
        resolver: zodResolver(UpdateProfileSchema)
    });

    // Populate form when data is loaded
    useEffect(() => {
        if (profile) {
            formContext.reset({
                email: profile.email,
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone,
                country: profile.country
            });
        }
    }, [profile, formContext]);

    const onSubmit = async (data: UserProfile) => {
        try {
            await updateUserProfile(data);
            enqueueSnackbar("Profile updated successfully!", { variant: "success" });
            navigate("/profile");
        } catch (error) {
            console.error(error);
            showApiError(error, "Failed to update profile");
        }
    };

    if (isLoading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
         return (
            <Box>
                <Typography color="error">Failed to load profile information.</Typography>
                <Button onClick={() => navigate("/profile")} sx={{ mt: 2 }}>
                    Back to Profile
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper elevation={0} variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <EditIcon color="primary" sx={{ mr: 1, fontSize: 30 }} />
                    <Typography variant="h6" fontWeight="600">Edit Profile</Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <FormContainer 
                    formContext={formContext} 
                    onSuccess={onSubmit}
                >
                    <Grid container spacing={3}>
                        
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextFieldElement
                                name="email"
                                label="Email"
                                type="email"
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextFieldElement
                                name="phone"
                                label="Phone Number"
                                required
                                fullWidth
                            />
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextFieldElement
                                name="firstName"
                                label="First Name"
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextFieldElement
                                name="lastName"
                                label="Last Name"
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextFieldElement
                                name="country"
                                label="Country"
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    sx={{ 
                                        px: 4, 
                                        py: 1.5, 
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </FormContainer>
            </Paper>
        </Box>
    );
};

export default EditProfilePage;
