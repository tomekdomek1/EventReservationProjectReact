// src/theme/themeConfig.ts
import { createTheme } from '@mui/material/styles';
import type { ThemeOptions, Theme } from '@mui/material/styles';

export const darkThemeOptions: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: { main: '#5893df' },
        secondary: { main: '#2ec5d3' },
        background: { default: '#192231', paper: '#24344d' },
        text: { primary: '#e0e0e0', secondary: '#bdbdbd' },
    },
};

export const lightThemeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: { main: '#5893df' },
        secondary: { main: '#2ec5d3' },
        background: { default: '#f4f6f8', paper: '#ffffff' },
        text: { primary: '#212121', secondary: '#757575' },
    },
};

export const getAppTheme = (mode: 'light' | 'dark'): Theme => {
    return createTheme(mode === 'dark' ? darkThemeOptions : lightThemeOptions);
}