import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Alert, Box, Divider, IconButton, Typography } from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import PeopleIcon from '@mui/icons-material/People';

import GenericDialog from '../../../components/common/GenericDialog';
import dayjs from 'dayjs';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SessionForm } from './SessionForm';
import type { EventSession } from '../../../types/Session';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher } from '../../../services/SessionApiService';
import type { PaginatedResponse } from '../../../types/Pagination';

export default function EventsSessionsTable() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // will be used to fetch data about event's session


    const [searchParams, setSearchParams] = useSearchParams();

    const { mutate } = useSWRConfig();

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
                            onConfirm={() => {
                                alert(JSON.stringify(thisRow, null, 4))
                            }}
                            content={<SessionForm initialData={thisRow} readonly={true} />}
                            hideActions
                        />
                        <GenericDialog
                            trigger={
                                <IconButton onClick={onClick}>
                                    <EditIcon />
                                </IconButton>
                            }
                            onConfirm={() => {
                                alert(JSON.stringify(thisRow, null, 4))
                            }}
                            content={<SessionForm initialData={thisRow} />}
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
                                alert(JSON.stringify(thisRow, null, 4));
                            }}
                            confirmText="Delete"
                            cancelText="Cancel"
                        />
                        <IconButton onClick={() => navigate(`${thisRow.id}`)}>
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
                    content={<SessionForm />}
                    onConfirm={() => {
                        alert("Created!")
                    }}
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