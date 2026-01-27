import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Alert, Box, Divider, IconButton, Typography } from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import GenericDialog from '../../../components/common/GenericDialog';
import SessionParticipantsDialog from './SessionParticipantsDialog';
import { useParams, useSearchParams } from 'react-router-dom';
import { SessionForm } from './SessionForm';
import type { EventSession } from '../../../types/Session';
import useSWR, { useSWRConfig } from 'swr';
import { createSession, deleteSession, exportSession, fetcher, updateSession } from '../../../services/SessionApiService';
import { getEvent } from '../../../services/EventApiService';
import type { PaginatedResponse } from '../../../types/Pagination';
import { useSnackbar } from 'notistack';
import { showApiError } from '../../../services/api';
import type { EventData } from '../../../types/Event';
import fileDownload from 'js-file-download';
import { useTranslation } from 'react-i18next';

export default function EventsSessionsTable() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();

    const [searchParams, setSearchParams] = useSearchParams();

    const { mutate } = useSWRConfig();

    const { enqueueSnackbar } = useSnackbar();

    const { data: fetchedEventDetails } = useSWR<EventData>(
        id ? `event-${id}` : null,
        () => getEvent(Number(id))
    );

    const paginationModel = {
        page: parseInt(searchParams.get('page') || '0', 10), // Mui GridPaginationModel index starts at 0
        pageSize: parseInt(searchParams.get('pageSize') || '5', 10)
    };

    const { data: eventSessionResponse, error, isLoading } = useSWR<PaginatedResponse<EventSession>>(
        `/event/${id}/sessions?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}`, // API's page starts at 1
        fetcher,
        {
            keepPreviousData: true,
        }
    );

    const handlePaginationModelChange = (newModel: GridPaginationModel) => {
        setSearchParams({
            page: newModel.page.toString(),
            pageSize: newModel.pageSize.toString()
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCreate = async (data: any) => {
        try {
            const eventId = Number(id);
            const formattedData = {
                ...data,
                startTime: data.startTime && typeof data.startTime.toISOString === 'function' ? data.startTime.toISOString() : data.startTime
            };
            await createSession(eventId, formattedData);

            mutate(
                `/event/${id}/sessions?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}`
            );

            enqueueSnackbar(t('admin.session_table.create_success'), {
                autoHideDuration: 3000,
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showApiError(error, t('admin.session_table.create_error'));
        }
    };



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEdit = async (sessionId: number, data: any) => {
        try {
            const formattedData = {
                ...data,
                startTime: data.startTime && typeof data.startTime.toISOString === 'function' ? data.startTime.toISOString() : data.startTime
            };
            await updateSession(sessionId, formattedData);

            mutate(
                `/event/${id}/sessions?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}`
            );

            enqueueSnackbar(t('admin.session_table.edit_success'), {
                autoHideDuration: 3000,
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showApiError(error, t('admin.session_table.edit_error'));
        }
    };


    const handleDelete = async (sessionId: number) => {
        try {
            await deleteSession(sessionId);

            mutate(
                `/event/${id}/sessions?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}`
            );

            enqueueSnackbar(t('admin.session_table.delete_success'), {
                autoHideDuration: 3000,
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showApiError(error, t('admin.session_table.delete_error'));
        }
    };

    const handleExport = async (sessionId: number) => {
        try {
            const response = await exportSession(sessionId);

            fileDownload(response.data, `session_export_${sessionId}.json`);

            enqueueSnackbar(t('admin.session_table.export_success'), { variant: "success" });
        } catch (error) {
            showApiError(error, t('admin.session_table.export_fail'));
        }
    };


    const eventSessionColumn: GridColDef[] = [
        { field: 'id', headerName: t('admin.session_table.columns.id'), width: 80 },
        { field: 'name', headerName: t('admin.session_table.columns.name'), flex: 2, minWidth: 150 },
        { field: 'startTime', headerName: t('admin.session_table.columns.start_time'), flex: 1.5, minWidth: 150 },
        { field: 'duration', headerName: t('admin.session_table.columns.duration'), flex: 1, minWidth: 120 },
        { field: 'currentReserved', headerName: t('admin.session_table.columns.current_reserved'), flex: 1, minWidth: 140 },
        { field: 'maxParticipants', headerName: t('admin.session_table.columns.max_participants'), flex: 1, minWidth: 140 },
        {
            field: 'action',
            headerName: t('admin.session_table.columns.action'),
            sortable: false,
            filterable: false,
            width: 260,
            renderCell: (params) => {
                const thisRow: EventSession = params.row;
                const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                };

                return (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <SessionParticipantsDialog
                            sessionId={thisRow.id}
                            sessionName={thisRow.name}
                            currentReserved={thisRow.currentReserved}
                        />
                        <GenericDialog
                            trigger={
                                <IconButton onClick={onClick}>
                                    <InfoIcon />
                                </IconButton>
                            }
                            content={<SessionForm initialData={thisRow} readonly={true} eventDetails={fetchedEventDetails} />}
                            hideActions
                        />
                        <GenericDialog
                            trigger={
                                <IconButton onClick={onClick}>
                                    <EditIcon />
                                </IconButton>
                            }
                            content={<SessionForm initialData={thisRow} onSubmit={(data) => handleEdit(thisRow.id, data)} eventDetails={fetchedEventDetails} />}
                            hideActions
                        />
                        <GenericDialog
                            trigger={
                                <IconButton onClick={onClick}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                            title={t('admin.session_table.delete_confirm_title')}
                            content={t('admin.session_table.delete_confirm_desc')}
                            onConfirm={() => {
                                handleDelete(thisRow.id)
                            }}
                            confirmText={t('admin.event_table.delete_btn')}
                            cancelText={t('admin.event_table.cancel_btn')}
                        />
                        <IconButton onClick={() => handleExport(thisRow.id)}>
                            <FileDownloadIcon />
                        </IconButton>
                    </div >
                );
            },
        },
    ];

    if (error) {
        return (
            <Box sx={{ p: 5 }}>
                <Alert severity="error">{t('admin.session_table.load_fail')}</Alert>
            </Box>
        );
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: "column", width: "auto", maxWidth: '100%', margin: 'auto', p: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: 'center', mb: 2 }}>
                <Typography variant='h5'>{t('admin.session_table.title')}</Typography>
                <GenericDialog
                    trigger={<IconButton>
                        <AddCircleOutlineIcon />
                    </IconButton>}
                    content={<SessionForm onSubmit={handleCreate} eventDetails={fetchedEventDetails} />}
                    hideActions
                />
            </Box>
            <Divider />
            <DataGrid
                rows={eventSessionResponse?.items || []}
                columns={eventSessionColumn}
                rowCount={eventSessionResponse?.totalCount || 0}
                loading={!eventSessionResponse && isLoading}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10, 25]}

                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}

                checkboxSelection={false}
                rowSelection={false}
                sx={{
                    '& .MuiDataGrid-virtualScroller': {
                        overflowX: 'auto',
                    },
                    '& .MuiDataGrid-main': {
                        minWidth: '100%',
                    }
                }}
                showToolbar
            />
        </Box>
    );
}