import { darkTheme, lightTheme } from '../theme/colors';
import type { Theme } from '../theme/colors';
import type { StyleSpecification } from '@maplibre/maplibre-react-native';
import lightMapTheme from '../assets/maps/ontap-map-style-light.json';
import darkMapTheme from '../assets/maps/ontap-map-style-dark.json';

export const themeService = {
    resolveTheme,
};

function resolveTheme(deviceTheme: 'light' | 'dark' | null): Theme & { mapTheme: StyleSpecification } {
    if (deviceTheme === 'dark') {
        return { ...darkTheme, mapTheme: darkMapTheme as StyleSpecification };
    }

    return { ...lightTheme, mapTheme: lightMapTheme as StyleSpecification };
}