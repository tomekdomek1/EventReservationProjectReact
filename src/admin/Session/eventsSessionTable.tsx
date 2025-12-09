import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Divider, IconButton, Typography } from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import PeopleIcon from '@mui/icons-material/People';

import GenericDialog from '../../components/GenericDialog';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import { SessionForm } from './sessionForm';


export interface EventSession {
    id: number;
    name: string;
    description: string | null;
    startTime: Dayjs;
    duration: number;    // inMinutes 
    maxParticipants: number; // Remember about post at SessionLimit table 
    currentReserved: number; // Remember about post at sessionLimit table
}

//Mock - should be replaced with fetching service with pagination. Fetch model will change due to pagination model at backend

const paginationModel = { page: 0, pageSize: 5 };

const rows: EventSession[] =
    [
        {
            "id": 248788,
            "name": "eos",
            "description": "Lorem ipsum",
            "startTime": dayjs("2025-06-18T00:46:41.9180538"),
            "duration": 15,
            "maxParticipants": 20,
            "currentReserved": 0
        },
        {
            "id": 248789,
            "name": "enim",
            "description": "Lorem ipsum",
            "startTime": dayjs("2025-06-18T01:01:41.9180538"),
            "duration": 15,
            "maxParticipants": 5,
            "currentReserved": 1
        },
        {
            "id": 248790,
            "name": "at",
            "description": "Lorem ipsum",
            "startTime": dayjs("2025-06-18T01:16:41.9180538"),
            "duration": 15,
            "maxParticipants": 20,
            "currentReserved": 0
        },
        {
            "id": 248791,
            "name": "quas",
            "description": "Lorem ipsum",
            "startTime": dayjs("2025-06-18T01:31:41.9180538"),
            "duration": 30,
            "maxParticipants": 10,
            "currentReserved": 0
        }
    ]


export default function EventsSessionsTable() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // will be used to fetch data about event's session
    const eventColumn: GridColDef[] = [
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
            rows={rows}
            columns={eventColumn}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection={false}
            onPaginationModelChange={(model, details) => {
                //on pagination fetch data
            }}
            rowSelection={false}
            sx={{ border: 0 }}
            showToolbar
        />
    </Box>
);
}