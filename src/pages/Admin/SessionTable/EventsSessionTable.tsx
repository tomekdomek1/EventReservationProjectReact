import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Alert, Box, Divider, IconButton, Typography } from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import PeopleIcon from '@mui/icons-material/People';

import GenericDialog from '../../../components/common/GenericDialog';
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

export default function EventsSessionsTable() {
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

            enqueueSnackbar("Success!", {
                autoHideDuration: 3000,
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showApiError(error, "Error occured while creating session");
        }
    };



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

            enqueueSnackbar("Success!", {
                autoHideDuration: 3000,
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showApiError(error, "Error occured while editing session");
        }
    };


    const handleDelete = async (sessionId: number) => {
        try {
            await deleteSession(sessionId);

            mutate(
                `/event/${id}/sessions?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}`
            );

            enqueueSnackbar("Success!", {
                autoHideDuration: 3000,
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showApiError(error, "Error occured while deleting session");
        }
    };

    const handleExport = async (sessionId: number) => {
        try {
            const response = await exportSession(sessionId);

            fileDownload(response.data, `session_export_${sessionId}.json`);

            enqueueSnackbar("Success!", { variant: "success" });
        } catch (error) {
            showApiError(error, "Export failed");
        }
    };


    const eventSessionColumn: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 80 },
        { field: 'name', headerName: 'Name', flex: 2, minWidth: 150 },
        { field: 'startTime', headerName: 'Start Time', flex: 1.5, minWidth: 150 },
        { field: 'duration', headerName: 'Duration (min)', flex: 1, minWidth: 120 },
        { field: 'currentReserved', headerName: 'Current Reserved', flex: 1, minWidth: 140 },
        { field: 'maxParticipants', headerName: 'Max Participants', flex: 1, minWidth: 140 },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            filterable: false,
            width: 220,
            renderCell: (params) => {
                const thisRow: EventSession = params.row;
                const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                };

                return (
                    <div style={{ display: 'flex', gap: '8px' }}>
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
                            title="Are you sure?"
                            content="Do you want to delete this session? It cannot be reverted."
                            onConfirm={() => {
                                handleDelete(thisRow.id)
                            }}
                            confirmText="Delete"
                            cancelText="Cancel"
                        />
                        <IconButton onClick={() => handleExport(thisRow.id)}>
                            <PeopleIcon />
                        </IconButton>
                    </div >
                );
            },
        },
    ];

    if (error) {
        return (
            <Box sx={{ p: 5 }}>
                <Alert severity="error">Failed to load events sessions.</Alert>
            </Box>
        );
    }


    return (
        <Box sx={{ display: 'flex', flexDirection: "column", width: "auto", maxWidth: '100%', margin: 'auto', p: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: 'center', mb: 2 }}>
                <Typography variant='h5'>Event's session list</Typography>
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