import { type JSX } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { RegisterSchema } from "../../types/AuthFormModel";
import { registerUser } from "../../services/AuthApiService";
import { showApiError } from "../../services/api";
import type { RegisterRequest } from "../../types/Auth";

export const RegistrationPage = (): JSX.Element => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const formContext = useForm<RegisterRequest>({
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            phone: "",
            country: ""
        },
        resolver: zodResolver(RegisterSchema)
    });

    const onSubmit = async (data: RegisterRequest) => {
        try {
            await registerUser(data);
            enqueueSnackbar("Registration successful! Please login.", { variant: "success" });
            navigate("/login");
        } catch (error) {
            console.error(error);
            showApiError(error, "Registration failed");
        }
    };

    return (
        <Paper sx={{ display: 'flex', flexDirection: "column", width: 500, maxWidth: '100%', margin: 'auto', p: 5, mt: 5 }} elevation={4}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', marginBottom: "25px" }}>
                Register
            </Typography>

            <FormContainer formContext={formContext} onSuccess={onSubmit}>
                <Box sx={{ display: 'flex', flexDirection: "column", gap: 3 }}>
                    <TextFieldElement
                        name="email"
                        label="Email"
                        type="email"
                        required
                        fullWidth
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextFieldElement
                            name="firstName"
                            label="First Name"
                            required
                            fullWidth
                        />
                        <TextFieldElement
                            name="lastName"
                            label="Last Name"
                            required
                            fullWidth
                        />
                    </Box>

                    <TextFieldElement
                        name="phone"
                        label="Phone Number"
                        required
                        fullWidth
                    />

                    <TextFieldElement
                        name="country"
                        label="Country"
                        required
                        fullWidth
                    />

                    <TextFieldElement
                        name="password"
                        label="Password"
                        type="password"
                        required
                        fullWidth
                    />

                    <TextFieldElement
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        required
                        fullWidth
                    />

                    <Button variant="contained" type="submit" fullWidth size="large">
                        Register
                    </Button>
                </Box>
            </FormContainer>
        </Paper>
    );
};

export default RegistrationPage;