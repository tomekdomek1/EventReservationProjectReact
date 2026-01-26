import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Box, Divider, IconButton, Typography, Alert } from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import React, { useMemo } from 'react';
import GenericDialog from '../../../components/common/GenericDialog';
import EventForm from './EventForm';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { EventData } from '../../../types/Event';
import useSWR from 'swr';
import { fetcher, createEvent, deleteEvent, updateEvent, exportEvent } from '../../../services/EventApiService';
import type { PaginatedResponse } from '../../../types/Pagination';
import { useSnackbar } from 'notistack';
import dayjs, { type Dayjs } from 'dayjs';
import { showApiError } from '../../../services/api';
import fileDownload from 'js-file-download';
import EventFilterBar from '../../Events/EventFilterBar';

export default function EventTable() {

    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();

    const { enqueueSnackbar } = useSnackbar();

    const paginationModel = {
        page: parseInt(searchParams.get('page') || '0', 10), // Mui GridPaginationModel index starts at 0
        pageSize: parseInt(searchParams.get('pageSize') || '5', 10)
    };

    const fromDateParam = searchParams.get('fromDate');
    const toDateParam = searchParams.get('toDate');
    const searchParam = searchParams.get('search');

    const swrKey = useMemo(() => {
        const params = new URLSearchParams();
        params.append('page', (paginationModel.page + 1).toString()); // API starts at 1
        params.append('pageSize', paginationModel.pageSize.toString());

        if (searchParam) {
            params.append('search', searchParam);
        }

        const effectiveFromDate = fromDateParam || dayjs().format('YYYY-MM-DD');
        params.append('fromDate', effectiveFromDate);

        if (toDateParam) {
            params.append('toDate', toDateParam);
        }

        return `/events/filter?${params.toString()}`;
    }, [paginationModel, fromDateParam, toDateParam, searchParam]);

    const { data: eventResponse, error, isLoading, mutate } = useSWR<PaginatedResponse<EventData>>(
        swrKey,
        fetcher,
        {
            keepPreviousData: true,
        }
    );

    const handleFilter = (newFrom: string | null, newTo: string | null, newSearch: string) => {
        setSearchParams(prev => {
            prev.set('page', '0'); // Reset to first page
            
            if (newSearch) {
                prev.set('search', newSearch);
            } else {
                prev.delete('search');
            }

            if (newFrom) {
                prev.set('fromDate', newFrom);
            } else {
                prev.set('fromDate', dayjs().format('YYYY-MM-DD'));
            }

            if (newTo) {
                prev.set('toDate', newTo);
            } else {
                prev.delete('toDate');
            }
            
            return prev;
        });
    };

    const handleClearFilter = () => {
        setSearchParams(prev => {
            prev.set('page', '0');
            prev.delete('fromDate');
            prev.delete('toDate');
            prev.delete('search');
            return prev;
        });
    };

    const handlePaginationModelChange = (newModel: GridPaginationModel) => {
        setSearchParams(prev => {
            prev.set('page', newModel.page.toString());
            prev.set('pageSize', newModel.pageSize.toString());
            return prev;
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCreate = async (data: any) => {
        try {
            await createEvent(data);
            await mutate();
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
            await mutate();
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
            await mutate();
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
            
            <Box sx={{ mt: 2 }}>
                 <EventFilterBar 
                    initialFromDate={fromDateParam || dayjs().format('YYYY-MM-DD')}
                    initialToDate={toDateParam}
                    initialSearch={searchParam}
                    onFilter={handleFilter}
                    onClear={handleClearFilter}
                />
            </Box>

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