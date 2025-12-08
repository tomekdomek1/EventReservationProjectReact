import React, { useMemo } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useThemeStore } from '../store/themeStore';
import { getAppTheme } from './themeConfig';

interface ThemeModeProviderProps {
    children: ReactNode;
}

export const ThemeModeProvider: React.FC<ThemeModeProviderProps> = ({ children }) => {
    const mode = useThemeStore((state) => state.mode);

    const theme = useMemo(() => getAppTheme(mode), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};