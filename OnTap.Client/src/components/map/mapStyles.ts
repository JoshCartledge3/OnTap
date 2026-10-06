import { StyleSheet } from 'react-native';
import type { ThemeColors } from '../../theme/colors';

export function createMapStyles(colors: ThemeColors) {
    return StyleSheet.create({
        pubMarker: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            borderRadius: 16,
            borderWidth: 1.5,
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderColor: colors.border,
            backgroundColor: colors.surface,
        },
        pubMarkerActive: {
            backgroundColor: colors.accent,
        },
        pubMarkerText: {
            color: colors.text,
        },
        pubMarkerTextActive: {
            color: colors.onAccent,
        },
    });
}
