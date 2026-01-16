import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouteLayout from './components/layout/RootLayout/RootLayout'
import EventsPage from './pages/Events/EventsPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import EventTable from './pages/Admin/EventTable/EventTable'
import LoginScreen from './pages/Auth/LoginPage'
import NotFoundPage from './pages/notFoundPage'
import { ThemeModeProvider } from './theme/ThemeModeProvider'
import EventsSessionsTable from './pages/Admin/SessionTable/EventsSessionTable'
import { SnackbarProvider } from 'notistack';

const router = createBrowserRouter([
  {
    element: <RouteLayout />,
    children: [
      { path: '/', element: <EventsPage /> },
      { path: '/login', element: <LoginScreen /> },
      { path: '/admin/events', element: <EventTable /> },
      { path: 'admin/events/:id', element: <EventsSessionsTable /> },
      { path: '*', element: <NotFoundPage /> }

    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <SnackbarProvider>
    <StrictMode>
      <ThemeModeProvider>
        <RouterProvider router={router} />
      </ThemeModeProvider>
    </StrictMode>,
  </SnackbarProvider>
)
