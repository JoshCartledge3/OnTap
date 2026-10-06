import { useContext } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { themeService } from '../services/ThemeService';

export function useTheme() {
    const provided = useContext(ThemeContext);
    if (!provided) {
        throw new Error('useTheme must be used within ThemeProvider.');
    }

    const deviceTheme = useColorScheme();
    return themeService.resolveTheme(deviceTheme === 'dark' ? 'dark' : 'light');
}