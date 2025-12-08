import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouteLayout from './App'
import HomePage from './homePage/HomePage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DataTable from './admin/eventTable'
import LoginScreen from './auth/loginScreen'
import NotFoundPage from './pages/notFoundPage'
import { ThemeModeProvider } from './theme/themeModeProvider'

const router = createBrowserRouter([
  {
    element: <RouteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginScreen /> },
      { path: '/admin/events', element: <DataTable /> },
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
