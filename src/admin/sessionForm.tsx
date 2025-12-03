import { type JSX } from "react";

import { Box, Button, Paper, Typography } from "@mui/material"

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui'
import { DateTimePickerElement } from "react-hook-form-mui/date-pickers";
import type { CreateSessionForm } from "./CreateSessionForm";



const SessionForm = (readonly: boolean = false): JSX.Element => {

    const formContext = useForm<CreateSessionForm>({});


    const onSubmit = (data: CreateSessionForm) => {
        console.log("FORM DATA:", data);
    };

    return (
        <FormContainer formContext={formContext} onSuccess={onSubmit}>
            <Typography variant="h5" sx={{ textAlign: 'left', marginBottom: "25px" }}>
                Create Session
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: "column", gap: 3 }}>
                <TextFieldElement
                    id="name-input"
                    label="Name"
                    name="name"
                    required
                    fullWidth
                    placeholder="Event name"
                    disabled={readonly}
                />

                <TextFieldElement
                    id="description-input"
                    label="Description"
                    name="description"
                    multiline
                    rows={5}
                    required
                    fullWidth
                    placeholder="Lorem ipsum"
                    disabled={readonly}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePickerElement
                        label="Start date"
                        name="startTime"
                        ampm={false}
                        disablePast
                        minutesStep={15}
                        required
                        disabled={readonly}
                    />
                </LocalizationProvider>
                <TextFieldElement
                    id="duration-input"
                    label="Duration"
                    name="duration"
                    required
                    fullWidth
                    type="number"
                    placeholder="Session duration"
                    disabled={readonly}
                />
                <TextFieldElement
                    id="maxParticipants-input"
                    label="Max participants"
                    name="maxParticipants"
                    required
                    fullWidth
                    type="number"
                    placeholder="Session max participants"
                    disabled={readonly}
                />
                <Button variant="contained" type="submit">
                    Add
                </Button>
            </Box>
        </FormContainer>
    )
}

export const SessionScreen = (): JSX.Element => {
    return (
        <Paper
            sx={{ display: 'flex', flexDirection: "column", width: 700, maxWidth: '100%', margin: 'auto', p: 5 }}
            elevation={4}
        >
            <SessionForm />
        </Paper>
    )
}
