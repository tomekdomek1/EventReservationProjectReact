import { useMemo, type JSX } from "react";
import { Box, Button, Typography } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormContainer, TextFieldElement, useForm } from 'react-hook-form-mui';
import { DateTimePickerElement } from "react-hook-form-mui/date-pickers";
import type { EventSession } from "../../../types/Session";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EventData } from "../../../types/Event";
import z from "zod";
import { SessionFormModel } from "../../../types/SessionFormModel";


type SessionFormProps = {
    readonly?: boolean;
    initialData?: EventSession;
    eventDetails?: EventData | null;
    onDialogClose?: () => void;
    onSubmit?: (data: EventSession) => Promise<void>;
};

export const SessionForm = ({ readonly = false, initialData, onDialogClose, onSubmit: parentSubmit, eventDetails }: SessionFormProps): JSX.Element => {

    const schema = useMemo(() => SessionFormModel(eventDetails), [eventDetails]);

    type FormInput = z.input<typeof schema>;
    type FormOutput = z.output<typeof schema>;


    const formContext = useForm<FormInput>({
        defaultValues: initialData as FormInput,
        resolver: zodResolver(schema),
        mode: "onChange",
        reValidateMode: "onChange",
        criteriaMode: "all",
    });

    const onSubmit = async (data: EventSession) => {
        if (parentSubmit) {
            await parentSubmit(data);
        }
        onDialogClose?.();
    };

    return (
        <>
            <Box sx={{ mb: 2 }}>
                <Typography variant="h6">
                    Associated event:
                </Typography>
                {eventDetails ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Name: {eventDetails.name} <br />
                        Start date: {eventDetails.startTime?.format('DD/MM/YYYY HH:mm')} <br />
                        End date: {eventDetails.endTime?.format('DD/MM/YYYY HH:mm')}
                    </Typography>
                ) : (
                    <Typography variant="body2" color="error">
                        Event details not available (Loading...)
                    </Typography>
                )}
            </Box>
            <FormContainer formContext={formContext} onSuccess={onSubmit}>
                <Typography variant="h5" sx={{ textAlign: 'left', marginBottom: "25px" }}>
                    {(() => {
                        if (initialData && readonly) return "Session details";
                        if (initialData) return "Edit session";
                        return "Create session";
                    })()}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: "column", gap: 3 }}>
                    <TextFieldElement
                        id="name-input"
                        label="Name"
                        name="name"
                        required
                        fullWidth
                        placeholder="Session name"
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
                            format="DD/MM/YYYY HH:mm"
                            ampm={false}
                            disablePast
                            minutesStep={15}
                            required
                            disabled={readonly}
                            minDateTime={eventDetails?.startTime}
                            maxDateTime={eventDetails?.endTime}
                        />
                    </LocalizationProvider>

                    <TextFieldElement
                        id="duration-input"
                        label="Duration (minutes)"
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
                        placeholder="Max participants"
                        disabled={readonly}
                    />

                    {readonly && (
                        <TextFieldElement
                            id="currentReserved-input"
                            label="Currently reserved"
                            name="currentReserved"
                            required
                            fullWidth
                            type="number"
                            disabled={readonly}
                        />
                    )}

                    {!readonly && (
                        <Button variant="contained" type="submit">
                            {initialData ? "Edit" : "Add"}
                        </Button>
                    )}
                </Box>
            </FormContainer>
        </>

    );
};

export const SessionScreen = (): JSX.Element => {
    return (
        <Box sx={{ display: 'flex', flexDirection: "column", width: 700, maxWidth: '100%', margin: 'auto', p: 5 }}>
            <SessionForm
                readonly={false}
                onDialogClose={() => console.log("Dialog closed")}
            />
        </Box>
    );
};
