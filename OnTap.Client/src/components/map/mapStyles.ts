import type { ThemeColors } from '../../theme/colors';
import {StyleSheet} from 'react-native';

// Artwork uses the supplied SVG's coordinate system. The pointer is below the beer.
export const pubMarkerScale = 0.175;
export const pubMarkerPointerX = 80.085 * pubMarkerScale;

export function createThemedMapStyles(colors: ThemeColors, active = false) {
    return {
        background: active ? colors.accent : colors.mapMarkerBackground,
        border: active ? colors.mapMarkerSelectedBorder : colors.mapMarkerBorder,
        foreground: colors.mapMarkerForeground,
        divider: active ? colors.mapMarkerForeground : colors.mapMarkerDivider,
    };
}

export const mapStyles = StyleSheet.create({
    mapIconButtonRound: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
