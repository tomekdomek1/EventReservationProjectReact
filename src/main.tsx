import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RouteLayout from './App'
import HomePage from './homePage/homePage'
import { ThemeProvider } from '@emotion/react'
import { createTheme, CssBaseline } from '@mui/material'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import DataTable from './admin/eventTable'
import LoginScreen from './auth/loginScreen'
import NotFoundPage from './pages/notFoundPage'

const router = createBrowserRouter([
  {
    element: <RouteLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginScreen /> },
      { path: '/admin/events', element: <DataTable /> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5893df',
    },
    secondary: {
      main: '#2ec5d3',
    },
    background: {
      default: '#192231',
      paper: '#24344d',
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)
