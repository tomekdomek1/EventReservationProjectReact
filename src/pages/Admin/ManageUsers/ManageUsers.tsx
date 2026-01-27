import React, { useMemo } from 'react';
import { DataGrid, type GridColDef, type GridPaginationModel } from '@mui/x-data-grid';
import { Box, Typography, Alert } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { fetcher } from '../../../services/UserApiService';
import type { PaginatedResponse } from '../../../types/Pagination';
import type { User } from '../../../types/User';

const ManageUsers: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const paginationModel = {
        page: parseInt(searchParams.get('page') || '0', 10),
        pageSize: parseInt(searchParams.get('pageSize') || '10', 10)
    };

    const swrKey = useMemo(() => {
        const params = new URLSearchParams();
        params.append('page', (paginationModel.page + 1).toString());
        params.append('pageSize', paginationModel.pageSize.toString());

        return `/users?${params.toString()}`;
    }, [paginationModel]);

    const { data: userResponse, error, isLoading } = useSWR<PaginatedResponse<User>>(
        swrKey,
        fetcher,
        {
            keepPreviousData: true,
        }
    );

    const handlePaginationModelChange = (newModel: GridPaginationModel) => {
        setSearchParams(prev => {
            prev.set('page', newModel.page.toString());
            prev.set('pageSize', newModel.pageSize.toString());
            return prev;
        });
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'email', headerName: t('admin.users_table.email'), flex: 1, minWidth: 200 },
        { field: 'firstName', headerName: t('admin.users_table.first_name'), flex: 1, minWidth: 150 },
        { field: 'lastName', headerName: t('admin.users_table.last_name'), flex: 1, minWidth: 150 },
        { field: 'phone', headerName: t('admin.users_table.phone'), flex: 1, minWidth: 150 },
        { field: 'country', headerName: t('admin.users_table.country'), flex: 0.8, minWidth: 120 },
        {
            field: 'roles',
            headerName: t('admin.users_table.role'),
            width: 150,
            valueGetter: (value: string[]) => value?.join(', ') || ''
        },
    ];

    if (error) {
        return (
            <Box sx={{ p: 5 }}>
                <Alert severity="error">{t('admin.users_table.load_fail')}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: "column", width: "auto", maxWidth: '100%', margin: 'auto', p: 5 }}>
            <Typography variant='h5' sx={{ mb: 2 }}>{t('admin.users_table.title')}</Typography>

            <DataGrid
                rows={userResponse?.items || []}
                rowCount={userResponse?.totalCount || 0}
                loading={!userResponse && isLoading}
                paginationMode="server"
                paginationModel={paginationModel}
                onPaginationModelChange={handlePaginationModelChange}
                columns={columns}
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
            />
        </Box>
    );
};

export default ManageUsers;
