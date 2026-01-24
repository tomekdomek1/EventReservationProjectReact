import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouteLayout from './components/layout/RootLayout/RootLayout'
import EventsPage from './pages/Events/EventsPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import EventTable from './pages/Admin/EventTable/EventTable'
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard'
import LoginScreen from './pages/Auth/LoginPage'
import RegistrationPage from './pages/Auth/RegistrationPage'
import UserProfilePage from './pages/User/Profile/UserProfilePage'
import UserProfileOverview from './pages/User/Profile/UserProfileOverview';
import EditProfilePage from './pages/User/Profile/EditProfilePage';
import ChangePasswordPage from './pages/User/Profile/ChangePasswordPage';
import { ThemeModeProvider } from './theme/ThemeModeProvider'
import EventsSessionsTable from './pages/Admin/SessionTable/EventsSessionTable'
import { SnackbarProvider } from 'notistack';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFoundPage from './pages/notFoundPage'

const router = createBrowserRouter([
  {
    element: <RouteLayout />,
    children: [
      { path: '/', element: <EventsPage /> },
      { path: '/login', element: <LoginScreen /> },
      { path: '/register', element: <RegistrationPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { 
            path: '/profile', 
            element: <UserProfilePage />,
            children: [
               { index: true, element: <UserProfileOverview /> },
               { path: 'edit', element: <EditProfilePage /> },
               { path: 'password', element: <ChangePasswordPage /> }
            ] 
          },
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={['Admin']} />,
        children: [
          { path: '/admin/dashboard', element: <AdminDashboard /> },
          { path: '/admin/events', element: <EventTable /> },
          { path: 'admin/events/:id', element: <EventsSessionsTable /> },
        ]
      },

      { path: '*', element: <NotFoundPage /> }

    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <SnackbarProvider autoHideDuration={3000}>
    <StrictMode>
      <ThemeModeProvider>
        <RouterProvider router={router} />
      </ThemeModeProvider>
    </StrictMode>,
  </SnackbarProvider>
)
