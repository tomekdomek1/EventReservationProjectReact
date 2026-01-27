import { type JSX } from "react";

import { Box, Button, Divider, FormGroup, FormLabel, Typography } from "@mui/material"

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { FormContainer, TextFieldElement, SwitchElement, useForm } from 'react-hook-form-mui'
import { DateTimePickerElement } from "react-hook-form-mui/date-pickers";

import type { CreateEventForm } from "./CreateEventForm";
import { EventFormModel } from "../../../types/EventFormModel";
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next";

type EventFormProps = {
    readonly?: boolean;
    initialData?: CreateEventForm;
    onDialogClose?: () => void;
    onSubmit?: (data: CreateEventForm) => Promise<void>;
};


export const EventForm = ({ readonly = false, initialData, onDialogClose, onSubmit: parentSubmit }: EventFormProps): JSX.Element => {
    const { t } = useTranslation();

    const formContext = useForm<CreateEventForm>({
        defaultValues: initialData ?? {
            isOverLappingAllowed: true,
        },
        resolver: zodResolver(EventFormModel),
        mode: 'onChange',
        reValidateMode: 'onChange',
        criteriaMode:'all'
    });

    const onSubmit = async (data: CreateEventForm) => {
        if (parentSubmit) {
            await parentSubmit(data);
        }
        onDialogClose?.();   // zamykanie dialogu po submit
    };


    return (
        <FormContainer formContext={formContext} onSuccess={onSubmit}>
            <Typography variant="h5" sx={{ textAlign: 'left', marginBottom: "25px" }}>
                {(() => {
                    if (initialData && readonly) {
                        return t('admin.event_form.details_title');
                    }
                    if (initialData) {
                        return t('admin.event_form.edit_title');
                    }
                    return t('admin.event_form.create_title');
                })()}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: "column", gap: 3 }}>
                <TextFieldElement
                    id="name-input"
                    label={t('admin.event_form.name')}
                    name="name"
                    required
                    fullWidth
                    placeholder={t('admin.event_form.name_placeholder')}
                    disabled={readonly}
                />

                <TextFieldElement
                    id="description-input"
                    label={t('admin.event_form.description')}
                    name="description"
                    multiline
                    rows={5}
                    required
                    fullWidth
                    placeholder={t('admin.event_form.description_placeholder')}
                    disabled={readonly}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                    <DateTimePickerElement
                        label={t('admin.event_form.start_date')}
                        name="startTime"
                        ampm={false}
                        disablePast
                        minutesStep={15}
                        required
                        disabled={readonly}
                        format="DD/MM/YYYY HH:mm"
                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pl">
                    <DateTimePickerElement
                        label={t('admin.event_form.end_date')}
                        name="endTime"
                        ampm={false}
                        disablePast
                        minutesStep={15}
                        required
                        disabled={readonly}
                        format="DD/MM/YYYY HH:mm"
                    />
                </LocalizationProvider>

                <TextFieldElement
                    id="location-input"
                    label={t('admin.event_form.location')}
                    name="location"
                    required
                    fullWidth
                    placeholder={t('admin.event_form.location_placeholder')}
                    disabled={readonly}
                />

                <FormGroup sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <FormLabel component="legend">
                        {t('admin.event_form.overlapping_allowed')}
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
                    label={t('admin.event_form.event_email')}
                    name="eventEmail"
                    required
                    fullWidth
                    placeholder={t('admin.event_form.event_email_placeholder')}
                    disabled={readonly}
                />

                <Divider />
                <FormLabel sx={{ mr: "auto" }}>{t('admin.event_form.coordinator_header')}</FormLabel>

                <Box sx={{ display: "flex", flexDirection: "row", gap: 2, width: "100%" }}>
                    <TextFieldElement
                        id="coordinatorName-input"
                        label={t('admin.event_form.coordinator_name')}
                        name="coordinatorName"
                        required
                        fullWidth
                        placeholder={t('admin.event_form.coordinator_name_placeholder')}
                        disabled={readonly}
                    />

                    <TextFieldElement
                        id="coordinatorSurname-input"
                        label={t('admin.event_form.coordinator_surname')}
                        name="coordinatorSurname"
                        required
                        fullWidth
                        placeholder={t('admin.event_form.coordinator_surname_placeholder')}
                        disabled={readonly}
                    />

                    <TextFieldElement
                        id="coordinatorPhone-input"
                        label={t('admin.event_form.coordinator_phone')}
                        name="coordinatorPhone"
                        required
                        fullWidth
                        placeholder={t('admin.event_form.coordinator_phone_placeholder')}
                        disabled={readonly}
                    />
                </Box>
                {!readonly && (
                    <Button variant="contained" type="submit">
                        {(() => {
                            if (initialData) {
                                return t('admin.event_form.submit_edit');
                            }
                            return t('admin.event_form.submit_add');
                        })()}
                    </Button>
                )}
            </Box>
        </FormContainer>
    )
}

export default EventForm;
