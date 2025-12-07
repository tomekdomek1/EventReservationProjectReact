import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouteLayout from './App'
import HomePage from './homePage/homePage'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DataTable from './admin/eventTable'
import LoginScreen from './auth/loginScreen'

const router = createBrowserRouter([
  {
    element: <RouteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginScreen /> },
      { path: '/admin/events', element: <DataTable /> }
    ]
  }
]);

const darkTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
