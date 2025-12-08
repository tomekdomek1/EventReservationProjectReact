import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, Button, Divider, IconButton, Typography } from '@mui/material';

import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'

import type { CreateEventForm } from './createEventForm';
import GenericDialog from '../components/GenericDialog';
import EventForm from './eventForm';
import GetEvents from '../mockData/getEventsNew';


const eventColumn: GridColDef[] = [
    { field: 'id', headerName: "ID", flex: 1 },
    { field: 'name', headerName: "Name", flex: 1 },
    { field: 'startTime', headerName: "Start date", flex: 1 },
    { field: 'endTime', headerName: "End Date", flex: 1 },
    { field: 'location', headerName: "Location", flex: 1 },
    // { field: 'eventEmail', headerName: "Event email", flex: 1 },
    // { field: 'coordinatorName', headerName: "Coordinator Name", flex: 1 },
    // { field: 'coordinatorSurname', headerName: "Coordinator Surname", flex: 1 },
    // { field: 'coordinatorPhone', headerName: "Coordinator Phone", flex: 1 },
    {
        field: "action",
        headerName: "Action",
        sortable: false,
        width: 150,
        filterable: false,
        hideable: false,
        renderCell: (params) => {
            const thisRow: CreateEventForm = params.row;
            const onClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
                e.stopPropagation();
            };

            return (
                <div style={{ display: "flex", }}>
                    <GenericDialog
                        trigger={<IconButton onClick={onClick}>
                            <InfoIcon />
                        </IconButton>}
                        content={<EventForm initialData={thisRow} readonly={true} />}
                        onConfirm={() => {
                            alert(JSON.stringify(thisRow, null, 4))
                        }}
                        hideActions
                    />
                    <GenericDialog
                        trigger={<IconButton onClick={onClick}>
                            <EditIcon />
                        </IconButton>}
                        content={<EventForm initialData={thisRow} />}
                        onConfirm={() => {
                            alert(JSON.stringify(thisRow, null, 4))
                        }}
                        hideActions
                    />
                    <GenericDialog
                        trigger={<IconButton onClick={onClick}>
                            <DeleteIcon />
                        </IconButton>}
                        title={"Are you sure?"}
                        content={"Do you want delete this event? It can not be revert."}
                        onConfirm={() => {
                            alert(JSON.stringify(thisRow, null, 4))
                        }}
                        confirmText='Delete'
                        cancelText='Cancel'
                    />

                </div>
            );
        }
    },
]

//Mock - should be replaced with fetching service with pagination. Fetch model will change due to pagination model at backend
const rows = GetEvents();

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
    return (
        <Box sx={{ display: 'flex', flexDirection: "column", width: "auto", maxWidth: '100%', margin: 'auto', p: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: 'center', mb: 2 }}>
                <Typography variant='h5'>Event list</Typography>
                <GenericDialog
                    trigger={<IconButton>
                        <InfoIcon />
                    </IconButton>}
                    content={<EventForm />}
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