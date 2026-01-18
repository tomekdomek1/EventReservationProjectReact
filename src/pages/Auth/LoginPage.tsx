import { type JSX } from "react";
import { Box, Button, Paper, Typography, Checkbox, FormControlLabel } from "@mui/material";
import { FormContainer, TextFieldElement, CheckboxElement, useForm } from 'react-hook-form-mui';
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { jwtDecode } from "jwt-decode";
import { LoginSchema } from "../../types/AuthFormModel";
import { loginUser } from "../../services/AuthApiService";
import { showApiError } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import type { LoginRequest, DecodedToken, UserData } from "../../types/Auth";

const LoginScreen = (): JSX.Element => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const login = useAuthStore((state) => state.login);

    const formContext = useForm<LoginRequest>({
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false
        },
        resolver: zodResolver(LoginSchema)
    });

    const onSubmit = async (data: LoginRequest) => {
        try {
            const response = await loginUser(data);
            const token = response.result;

            if (token) {
                const decoded: DecodedToken = jwtDecode(token);

                const userData: UserData = {
                    id: response.id,
                    email: decoded.email || data.email,
                    role: decoded.role,
                    exp: decoded.exp
                };

                login(token, userData);

                enqueueSnackbar("Login successful!", { variant: "success" });
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            showApiError(error, "Login failed");
        }
    };

    return (
        <Paper sx={{ display: 'flex', flexDirection: "column", width: 400, maxWidth: '100%', margin: 'auto', p: 5, mt: 5 }} elevation={4}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', marginBottom: "25px" }}>
                Login
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

                    <TextFieldElement
                        name="password"
                        label="Password"
                        type="password"
                        required
                        fullWidth
                    />

                    <CheckboxElement
                        name="rememberMe"
                        label="Remember me"
                    />

                    <Button variant="contained" type="submit" fullWidth size="large">
                        Login
                    </Button>
                </Box>
            </FormContainer>
        </Paper>
    );
};

export default LoginScreen;