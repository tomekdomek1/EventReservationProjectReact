import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "./root/header";
import Footer from "./root/footer";
import { Box } from '@mui/material';

const RootLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
};

export default RootLayout;