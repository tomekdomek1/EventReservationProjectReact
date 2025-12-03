import { type JSX } from "react";

import { Box, Button, Divider, FormGroup, FormLabel, Typography } from "@mui/material"

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { FormContainer, TextFieldElement, SwitchElement, useForm } from 'react-hook-form-mui'
import { DateTimePickerElement } from "react-hook-form-mui/date-pickers";

import type { CreateEventForm } from "./createEventForm";

type EventFormProps = {
    readonly?: boolean;
    initialData?: CreateEventForm;
};

export const EventForm = ({ readonly = false, initialData }: EventFormProps): JSX.Element => {

    const formContext = useForm<CreateEventForm>({
        defaultValues: initialData ?? {
            isOverLappingAllowed: true,
        },
    });

    const onSubmit = (data: CreateEventForm) => {
        console.log("FORM DATA:", data);
    };

    return (
        <FormContainer formContext={formContext} onSuccess={onSubmit}>
            <Typography variant="h5" sx={{ textAlign: 'left', marginBottom: "25px" }}>
                {(() => {
                    if (initialData && readonly) {
                        return "Event details";
                    }
                    if (initialData) {
                        return "Edit event";
                    }
                    return "Create event";
                })()}
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

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePickerElement
                        label="End date"
                        name="endTime"
                        ampm={false}
                        disablePast
                        minutesStep={15}
                        required
                        disabled={readonly}
                    />
                </LocalizationProvider>

                <TextFieldElement
                    id="location-input"
                    label="Location"
                    name="location"
                    required
                    fullWidth
                    placeholder="Event's location"
                    disabled={readonly}
                />

                <FormGroup sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <FormLabel component="legend">
                        Is session overlapping allowed?
                    </FormLabel>
                    <SwitchElement
                        name="isOverLappingAllowed"
                        label=""
                        sx={{ marginLeft: "5px" }}
                        disabled={readonly}
                    />
                </FormGroup>

                <TextFieldElement
                    id="eventemail-input"
                    label="Event email"
                    name="eventEmail"
                    required
                    fullWidth
                    placeholder="Event's email"
                    disabled={readonly}
                />

                <Divider />
                <FormLabel sx={{ mr: "auto" }}>Event Coordinator details</FormLabel>

                <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}>
                    <TextFieldElement
                        id="coordinatorName-input"
                        label="Coordinator Name"
                        name="coordinatorName"
                        required
                        fullWidth
                        placeholder="Coordinator name"
                        disabled={readonly}
                    />

                    <TextFieldElement
                        id="coordinatorSurname-input"
                        label="Coordinator Surname"
                        name="coordinatorSurname"
                        required
                        fullWidth
                        placeholder="Coordinator surname"
                        disabled={readonly}
                    />

                    <TextFieldElement
                        id="coordinatorPhone-input"
                        label="Coordinator phone"
                        name="coordinatorPhone"
                        required
                        fullWidth
                        placeholder="Coordinator phone"
                        disabled={readonly}
                    />
                </Box>
                {readonly === false ? (<Button variant="contained" type="submit">
                    {initialData ? "Save changes" : "Add"}
                </Button>) : ''}
            </Box>
        </FormContainer>
    )
}

export default EventForm;
