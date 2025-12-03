import { useState, type JSX } from "react";

import { Box, Button, Paper, TextField, Typography } from "@mui/material"

//Placeholder for service in the future
const LoginUser = (email: string, password: string): void => {
    console.log("Email", email);
    console.log("Password", password);
}

const isEmailFormatValid = (email: string): boolean => {
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

const getEmailErrorMessage = (email: string): string => {
    if (email.length === 0) {
        return "Field is required.";
    }
    if (!isEmailFormatValid(email)) {
        return "Invalid e-mail format."
    }
    return "";
}

const LoginForm = (): JSX.Element => {
    const [emailField, setEmailField] = useState<string>("")
    const [passwordField, setPasswordField] = useState<string>("")

    const [isEmailError, setIsEmailError] = useState<boolean>(false);
    const [isPasswordError, setIsPasswordError] = useState<boolean>(false);

    const handleEmailOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const email = event.target.value;
        setEmailField(email);
    }

    const handleLoginClick = () => {
        if (!isEmailFormatValid(emailField)) {
            setIsEmailError(true);
        }
        if (passwordField.length === 0) {
            setIsPasswordError(true);
        }
        LoginUser(emailField, passwordField);
    };

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', marginBottom: "25px" }}>
                Login
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: "column", gap: 3 }}>
                <TextField
                    error={isEmailError}
                    helperText={isEmailError ? getEmailErrorMessage(emailField) : ""}
                    id="email-input"
                    label="Email"
                    name="email"
                    required
                    fullWidth
                    placeholder="example@example.com"
                    onChange={(event) => handleEmailOnChange(event)}
                    onBlur={() => {
                        if (!isEmailFormatValid(emailField)) {
                            setIsEmailError(true);
                        } else {
                            setIsEmailError(false);
                        }
                    }}
                />
                <TextField
                    error={isPasswordError}
                    helperText={isPasswordError ? "Field is required" : ""}
                    id="password-input"
                    label="Password"
                    name="password"
                    required
                    fullWidth
                    placeholder="Password"
                    type="password"
                    onChange={(event) => setPasswordField(event.target.value)}
                    onBlur={() => {
                        if (!passwordField) {
                            setIsPasswordError(true);
                        } else {
                            setIsPasswordError(false);
                        }
                    }}
                />
                <Button
                    disabled={isEmailError || isPasswordError}
                    variant="contained"
                    type="submit"
                    onClick={handleLoginClick}
                >Login</Button>
            </Box>
        </>
    )
}


const LoginScreen = (): JSX.Element => {

    return (
        <>
            <Paper sx={{ display: 'flex', flexDirection: "column", width: 400, maxWidth: '100%', margin: 'auto', p: 5 }}  elevation={4}>
                <LoginForm />
            </Paper>
        </>
    )
}

export default LoginScreen;
