import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouteLayout from './App'
import HomePage from './homePage/HomePage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DataTable from './admin/Event/eventTable'
import LoginScreen from './auth/loginScreen'
import NotFoundPage from './pages/notFoundPage'
import { ThemeModeProvider } from './theme/themeModeProvider'
import EventsSessionsTable from './admin/Session/eventsSessionTable'

const router = createBrowserRouter([
  {
    element: <RouteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginScreen /> },
      { path: '/admin/events', element: <DataTable /> },
      { path: 'admin/events/:id', element: <EventsSessionsTable/> },
      { path: '*', element: <NotFoundPage /> }
      
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <RouterProvider router={router} />
    </ThemeModeProvider>
  </StrictMode>,
)
