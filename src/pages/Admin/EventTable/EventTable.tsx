import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Box, Divider, IconButton, Typography, Alert } from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import React from 'react';
import GenericDialog from '../../../components/common/GenericDialog';
import EventForm from './EventForm';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { EventData } from '../../../types/Event';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher, createEvent, deleteEvent, updateEvent, exportEvent } from '../../../services/EventApiService';
import type { PaginatedResponse } from '../../../types/Pagination';
import { useSnackbar } from 'notistack';
import type { Dayjs } from 'dayjs';
import { showApiError } from '../../../services/api';
import fileDownload from 'js-file-download';

export default function EventTable() {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const { mutate } = useSWRConfig();

    const { enqueueSnackbar } = useSnackbar();

    const paginationModel = {
        page: parseInt(searchParams.get('page') || '0', 10), // Mui GridPaginationModel index starts at 0
        pageSize: parseInt(searchParams.get('pageSize') || '5', 10)
    };

    const { data: eventResponse, error, isLoading } = useSWR<PaginatedResponse<EventData>>(
        `/events?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}`, // API's page starts at 1
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
            await createEvent(data);

            mutate(
                `/events?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}`
            );

            enqueueSnackbar("Success!", {
                autoHideDuration: 3000,
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showApiError(error, "Wystąpił błąd podczas edycji wydarzenia");
        }
    };



    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleEdit = async (id: number, data: any) => {
        try {
            await updateEvent(id, data);

            mutate(
                `/events?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}`
            );

            enqueueSnackbar("Success!", {
                autoHideDuration: 3000,
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showApiError(error, "Wystąpił błąd podczas edycji wydarzenia");
        }
    };


    const handleDelete = async (id: number) => {
        try {
            await deleteEvent(id);

            mutate(
                `/events?page=${paginationModel.page + 1}&pageSize=${paginationModel.pageSize}`
            );

            enqueueSnackbar("Success!", {
                autoHideDuration: 3000,
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showApiError(error, "Wystąpił błąd podczas edycji wydarzenia");
        }
    };


    const handleExport = async (eventId: number, eventName: string) => {
        try {
            const response = await exportEvent(eventId);
            fileDownload(response.data, `event_${eventName.replace(/\s+/g, '_')}_${eventId}.json`);
            enqueueSnackbar("Export successful!", {
                autoHideDuration: 3000,
                variant: "success",
            });
        } catch (error) {
            console.error(error);
            showApiError(error, "Export failed");
        }
    };


    const eventColumn: GridColDef[] = [
        { field: 'id', headerName: "ID", flex: 0.5, minWidth: 70 },
        { field: 'name', headerName: "Name", flex: 1.5, minWidth: 150 },
        { field: 'startTime', headerName: "Start date", flex: 1, minWidth: 120, valueFormatter: (value: Dayjs) => value?.format('DD/MM/YYYY HH:mm') },
        { field: 'endTime', headerName: "End Date", flex: 1, minWidth: 120, valueFormatter: (value: Dayjs) => value?.format('DD/MM/YYYY HH:mm') },
        { field: 'location', headerName: "Location", flex: 1, minWidth: 500 },
        {
            field: "action",
            headerName: "Action",
            sortable: false,
            flex: 1.2,
            filterable: false,
            hideable: false,
            minWidth: 200,
            renderCell: (params) => {
                const thisRow: EventData = params.row;
                const onClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
                    e.stopPropagation();
                };

                return (
                    <div style={{ display: "flex", gap: "4px" }}>
                        <GenericDialog
                            trigger={<IconButton onClick={onClick}><InfoIcon /></IconButton>}
                            content={<EventForm initialData={thisRow} readonly={true} />}
                            hideActions
                        />
                        <GenericDialog
                            trigger={<IconButton onClick={onClick}><EditIcon /></IconButton>}
                            content={<EventForm initialData={thisRow} onSubmit={(data) => handleEdit(thisRow.id, data)} />}
                            hideActions
                        />

                        <GenericDialog
                            trigger={<IconButton onClick={onClick}><DeleteIcon /></IconButton>}
                            title={"Are you sure?"}
                            content={"Do you want delete this event? It cannot be reverted."}
                            onConfirm={() => handleDelete(thisRow.id)}
                            confirmText='Delete'
                            cancelText='Cancel'
                        />
                        <IconButton onClick={() => handleExport(thisRow.id, thisRow.name)}>
                            <FileDownloadIcon />
                        </IconButton>
                        <IconButton onClick={() => navigate(`${thisRow.id}`)}>
                            <LibraryAddIcon />
                        </IconButton>
                    </div>
                );
            }
        },
    ]

    if (error) {
        return (
            <Box sx={{ p: 5 }}>
                <Alert severity="error">Failed to load events.</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", width: "auto", maxWidth: '100%', margin: 'auto', p: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: 'center', mb: 2 }}>
                <Typography variant='h5'>Event list</Typography>
                <GenericDialog
                    trigger={<IconButton>
                        <AddCircleOutlineIcon />
                    </IconButton>}
                    content={<EventForm onSubmit={handleCreate} />}
                    onConfirm={() => {
                        alert("Created!")
                    }}
                    hideActions
                />
            </Box>
            <Divider />
            <DataGrid
                // Data
                rows={eventResponse?.items || []}
                rowCount={eventResponse?.totalCount || 0}

                // If not first time fetching, loading during fetch should be false and we use keepPreviousData in useSWR
                loading={!eventResponse && isLoading}

                // Pagination
                paginationMode="server" // so the component uses rowCount instead of rows.length and shows next page
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}

                columns={eventColumn}
                pageSizeOptions={[5, 10, 25]}
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