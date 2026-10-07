import type {StyleSpecification} from '@maplibre/maplibre-react-native';
import type {MapStyleOption} from '../types/MapStyleOption';
import lightTopographicStyle from '../assets/maps/ontap-topographic-style-light.json';
import darkTopographicStyle from '../assets/maps/ontap-topographic-style-dark.json';

export function getMapStyle(
    option: MapStyleOption,
    mapTheme: StyleSpecification,
    colorScheme: 'light' | 'dark',
): StyleSpecification {
    if (option === 'ontap') return mapTheme;
    return (colorScheme === 'dark' ? darkTopographicStyle : lightTopographicStyle) as unknown as StyleSpecification;
}
