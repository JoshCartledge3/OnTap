import type { ThemeColors } from '../../theme/colors';

// Artwork uses the supplied SVG's coordinate system. The pointer is below the beer.
export const pubMarkerScale = 0.25;
export const pubMarkerPointerX = 80.085 * pubMarkerScale;

export function createMapStyles(colors: ThemeColors, active = false) {
    return {
        background: active ? colors.accent : colors.mapMarkerBackground,
        border: active ? colors.mapMarkerSelectedBorder : colors.mapMarkerBorder,
        foreground: colors.mapMarkerForeground,
        divider: active ? colors.mapMarkerForeground : colors.mapMarkerDivider,
    };
}
