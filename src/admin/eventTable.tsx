import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Box, Button, Divider, IconButton, Typography } from '@mui/material';

import dayjs from 'dayjs';

import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'

import type { CreateEventForm } from './createEventForm';
import GenericDialog from '../components/GenericDialog';
import EventForm from './eventForm';


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
function getEvents(): CreateEventForm[] {
    const strings = [{
        "id": 50770,
        "name": "Cole, Turner and Nikolaus",
        "description": "Libero asperiores minus sapiente est omnis voluptatibus perferendis eaque molestiae enim et deserunt unde eligendi enim sunt omnis voluptas est.",
        "startTime": "2025-06-18T00:46:41.9180538",
        "endTime": "2025-06-19T00:46:41.9180538",
        "location": "29630 Arch Crossing, New Carmelbury, Cote d'Ivoire",
        "eventEmail": "ColeTurnerandNikolaus.Hammes67@yahoo.com",
        "isOverLappingAllowed": false,
        "coordinatorName": "Laurianne",
        "coordinatorSurname": "Hansen",
        "coordinatorPhone": "224.955.4735"
    },
    {
        "id": 63489,
        "name": "Hyatt LLC",
        "description": "Laudantium ducimus unde velit minus consequatur sit omnis sit nihil mollitia est necessitatibus officiis hic aut autem sequi aut ut.",
        "startTime": "2025-06-18T01:13:50.5561799",
        "endTime": "2025-06-19T01:13:50.5561799",
        "location": "172 Konopelski Common, New Genevieve, Kyrgyz Republic",
        "eventEmail": "HyattLLC10@gmail.com",
        "isOverLappingAllowed": false,
        "coordinatorName": "Berniece",
        "coordinatorSurname": "Walsh",
        "coordinatorPhone": "815-688-5108"
    },
    {
        "id": 52692,
        "name": "Hammes, Feest and Senger",
        "description": "Eum in assumenda eos doloribus commodi sint repudiandae sed aut facere doloribus quia nesciunt commodi eius architecto aperiam soluta qui.",
        "startTime": "2025-06-18T01:24:27.3035136",
        "endTime": "2025-06-23T01:24:27.3035136",
        "location": "25671 Rosalinda Cove, Pacochaside, Uganda",
        "eventEmail": "HammesFeestandSenger_Osinski73@hotmail.com",
        "isOverLappingAllowed": false,
        "coordinatorName": "Alejandra",
        "coordinatorSurname": "Tromp",
        "coordinatorPhone": "1-802-268-4990 x86045"
    },
    {
        "id": 55202,
        "name": "Lehner - Heaney",
        "description": "Consequuntur et et minus incidunt corporis temporibus quaerat harum repudiandae quidem tenetur ut quisquam occaecati odit aut eum hic quod.",
        "startTime": "2025-06-18T01:48:09.6458366",
        "endTime": "2025-06-19T01:48:09.6458366",
        "location": "274 Rosenbaum Stravenue, Port Tyrell, Nepal",
        "eventEmail": "Lehner-Heaney.Gutmann@yahoo.com",
        "isOverLappingAllowed": false,
        "coordinatorName": "Abel",
        "coordinatorSurname": "Lynch",
        "coordinatorPhone": "(611) 410-6269 x17384"
    },
    {
        "id": 65622,
        "name": "Bosco - Bashirian",
        "description": "Eaque dolorem expedita sit debitis ut voluptatem voluptate cupiditate dolorum molestias doloremque et esse aut cum quia autem eius quo.",
        "startTime": "2025-06-18T02:02:20.3328271",
        "endTime": "2025-06-19T02:02:20.3328271",
        "location": "761 Vandervort Roads, Beverlyland, Lebanon",
        "eventEmail": "Bosco-Bashirian34@yahoo.com",
        "isOverLappingAllowed": false,
        "coordinatorName": "Alden",
        "coordinatorSurname": "Hackett",
        "coordinatorPhone": "(477) 285-6909"
    },
    {
        "id": 69202,
        "name": "Rippin and Sons",
        "description": "Voluptatem totam odit non voluptatum et voluptatum in quidem cupiditate placeat quod unde sit sit nesciunt molestias temporibus necessitatibus explicabo.",
        "startTime": "2025-06-18T03:03:20.2323265",
        "endTime": "2025-06-21T03:03:20.2323265",
        "location": "76368 Heaven Corner, Port Sandyhaven, Tonga",
        "eventEmail": "RippinandSons.Ernser39@gmail.com",
        "isOverLappingAllowed": true,
        "coordinatorName": "Taylor",
        "coordinatorSurname": "Gerlach",
        "coordinatorPhone": "1-417-923-6978 x387"
    },
    {
        "id": 66307,
        "name": "Davis LLC",
        "description": "Quos rerum fugiat aut aliquam ut eveniet magni omnis adipisci ut et fuga est iure harum nobis autem natus fugiat.",
        "startTime": "2025-06-18T04:26:14.8412516",
        "endTime": "2025-06-21T04:26:14.8412516",
        "location": "8905 Hilpert Curve, East Hilmafort, Turkey",
        "eventEmail": "DavisLLC_Heathcote13@hotmail.com",
        "isOverLappingAllowed": false,
        "coordinatorName": "Yvonne",
        "coordinatorSurname": "Bayer",
        "coordinatorPhone": "(920) 917-2776"
    },
    {
        "id": 66761,
        "name": "Maggio - Hermann",
        "description": "Ad mollitia vel eum est architecto recusandae ut enim cum architecto ducimus soluta eaque ex et nobis consequatur exercitationem sint.",
        "startTime": "2025-06-18T04:55:40.5014364",
        "endTime": "2025-06-23T04:55:40.5014364",
        "location": "0771 Ankunding Turnpike, West Bernie, Thailand",
        "eventEmail": "Maggio-Hermann.Kertzmann91@gmail.com",
        "isOverLappingAllowed": false,
        "coordinatorName": "Kasandra",
        "coordinatorSurname": "Ernser",
        "coordinatorPhone": "625.377.6976"
    },
    {
        "id": 58738,
        "name": "Crona LLC",
        "description": "Fugit in eum doloremque ducimus numquam et minus mollitia laborum qui sint non aut qui dicta quibusdam fugit est totam.",
        "startTime": "2025-06-18T05:20:35.0684446",
        "endTime": "2025-06-21T05:20:35.0684446",
        "location": "81618 Blanda Cove, North Burleymouth, Nepal",
        "eventEmail": "CronaLLC.Fadel47@hotmail.com",
        "isOverLappingAllowed": false,
        "coordinatorName": "Precious",
        "coordinatorSurname": "Harris",
        "coordinatorPhone": "894-814-3089"
    },
    {
        "id": 68975,
        "name": "Witting - Fadel",
        "description": "Voluptatem quia veritatis est exercitationem iure et molestiae in sint molestias quo et unde aut harum enim et explicabo voluptatem.",
        "startTime": "2025-06-18T05:44:19.2616786",
        "endTime": "2025-06-23T05:44:19.2616786",
        "location": "64046 Cornell Parkway, East Columbus, Uganda",
        "eventEmail": "Witting-Fadel57@gmail.com",
        "isOverLappingAllowed": false,
        "coordinatorName": "Esta",
        "coordinatorSurname": "Swaniawski",
        "coordinatorPhone": "843.598.8755 x221"
    }]
    return strings.map(s => ({
        ...s,
        id: s.id as number,
        startTime: dayjs(s.startTime, 'DD-MM-YYYY HH:mm:ss'),
        endTime: dayjs(s.endTime, 'DD-MM-YYYY HH:mm:ss')
    }));
}
const rows = getEvents();

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable() {
    return (
        <Paper sx={{ display: 'flex', flexDirection: "column", width: "auto", maxWidth: '100%', margin: 'auto', p: 5 }} elevation={4}>
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
        </Paper>
    );
}