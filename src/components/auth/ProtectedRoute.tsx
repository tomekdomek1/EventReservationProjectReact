import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const user = useAuthStore((state) => state.user);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!user) {
            enqueueSnackbar("You need to be logged in to access this page", { variant: "warning" });
        } else if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
            enqueueSnackbar("You do not have permission to access this page", { variant: "error" });
        }
    }, [user, allowedRoles, enqueueSnackbar]);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && (!user.role || !allowedRoles.includes(user.role))) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
