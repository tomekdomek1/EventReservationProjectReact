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
import { useTranslation } from "react-i18next";


type SessionFormProps = {
    readonly?: boolean;
    initialData?: EventSession;
    eventDetails?: EventData | null;
    onDialogClose?: () => void;
    onSubmit?: (data: EventSession) => Promise<void>;
};

export const SessionForm = ({ readonly = false, initialData, onDialogClose, onSubmit: parentSubmit, eventDetails }: SessionFormProps): JSX.Element => {
    const { t } = useTranslation();

    const schema = useMemo(() => SessionFormModel(eventDetails), [eventDetails]);

    type FormInput = z.input<typeof schema>;


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
                    {t('admin.session_form.associated_event')}
                </Typography>
                {eventDetails ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {t('admin.session_form.event_name', { name: eventDetails.name })} <br />
                        {t('admin.session_form.event_start', { date: eventDetails.startTime?.format('DD/MM/YYYY HH:mm') })} <br />
                        {t('admin.session_form.event_end', { date: eventDetails.endTime?.format('DD/MM/YYYY HH:mm') })}
                    </Typography>
                ) : (
                    <Typography variant="body2" color="error">
                        {t('admin.session_form.event_loading')}
                    </Typography>
                )}
            </Box>
            <FormContainer formContext={formContext} onSuccess={onSubmit}>
                <Typography variant="h5" sx={{ textAlign: 'left', marginBottom: "25px" }}>
                    {(() => {
                        if (initialData && readonly) return t('admin.session_form.details_title');
                        if (initialData) return t('admin.session_form.edit_title');
                        return t('admin.session_form.create_title');
                    })()}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: "column", gap: 3 }}>
                    <TextFieldElement
                        id="name-input"
                        label={t('admin.session_form.name')}
                        name="name"
                        required
                        fullWidth
                        placeholder={t('admin.session_form.name_placeholder')}
                        disabled={readonly}
                    />

                    <TextFieldElement
                        id="description-input"
                        label={t('admin.session_form.description')}
                        name="description"
                        multiline
                        rows={5}
                        required
                        fullWidth
                        placeholder={t('admin.session_form.description_placeholder')}
                        disabled={readonly}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePickerElement
                            label={t('admin.session_form.start_date')}
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
                        label={t('admin.session_form.duration')}
                        name="duration"
                        required
                        fullWidth
                        type="number"
                        placeholder={t('admin.session_form.duration_placeholder')}
                        disabled={readonly}
                    />

                    <TextFieldElement
                        id="maxParticipants-input"
                        label={t('admin.session_form.max_participants')}
                        name="maxParticipants"
                        required
                        fullWidth
                        type="number"
                        placeholder={t('admin.session_form.max_participants_placeholder')}
                        disabled={readonly}
                    />

                    {readonly && (
                        <TextFieldElement
                            id="currentReserved-input"
                            label={t('admin.session_form.current_reserved')}
                            name="currentReserved"
                            required
                            fullWidth
                            type="number"
                            disabled={readonly}
                        />
                    )}

                    {!readonly && (
                        <Button variant="contained" type="submit">
                            {initialData ? t('admin.session_form.submit_edit') : t('admin.session_form.submit_add')}
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
