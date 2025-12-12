import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { Box, Divider, IconButton, Typography } from '@mui/material';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';

import GenericDialog from '../../../components/common/GenericDialog';
import dayjs from 'dayjs';
import GetEvents from '../../../services/getEventsNew';
import { useNavigate } from 'react-router-dom';
import type { EventData } from '../../../types/Event';



//Mock - should be replaced with fetching service with pagination. Fetch model will change due to pagination model at backend
const rows = GetEvents();

const paginationModel = { page: 0, pageSize: 5 };



export default function EventTable() {
    const navigate = useNavigate();
    const eventColumn: GridColDef[] = [
        { field: 'id', headerName: "ID", flex: 0.5, minWidth: 70 },
        { field: 'name', headerName: "Name", flex: 1.5, minWidth: 150 },
        { field: 'startTime', headerName: "Start date", flex: 1, minWidth: 120 },
        { field: 'endTime', headerName: "End Date", flex: 1, minWidth: 120 },
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
                            onConfirm={() => alert(JSON.stringify(thisRow, null, 4))}
                            hideActions
                        />
                        <GenericDialog
                            trigger={<IconButton onClick={onClick}><EditIcon /></IconButton>}
                            content={<EventForm initialData={thisRow} />}
                            onConfirm={() => alert(JSON.stringify(thisRow, null, 4))}
                            hideActions
                        />
                        <GenericDialog
                            trigger={<IconButton onClick={onClick}><DeleteIcon /></IconButton>}
                            title={"Are you sure?"}
                            content={"Do you want delete this event? It cannot be reverted."}
                            onConfirm={() => alert(JSON.stringify(thisRow, null, 4))}
                            confirmText='Delete'
                            cancelText='Cancel'
                        />
                        <IconButton onClick={() => navigate(`${thisRow.id}`)}>
                            <LibraryAddIcon />
                        </IconButton>
                    </div>
                );
            }
        },
    ]



    return (
        <Box sx={{ display: 'flex', flexDirection: "column", width: "auto", maxWidth: '100%', margin: 'auto', p: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: 'center', mb: 2 }}>
                <Typography variant='h5'>Event list</Typography>
                <GenericDialog
                    trigger={<IconButton>
                        <AddCircleOutlineIcon />
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