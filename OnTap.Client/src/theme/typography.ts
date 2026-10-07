import type { TextStyle } from 'react-native';

export const fontFamily = 'DM Sans 9pt';

export const fontWeights = {
    light: '300',
    regular: '400',
    bold: '700',
} as const;

// Explicit iOS PostScript names select the actual faces, including the light family.
export const iosFontFaces = {
    light: { normal: 'DMSans-9ptLight', italic: 'DMSansItalic-9ptLightItalic' },
    regular: { normal: 'DMSans-9pt', italic: 'DMSansItalic-9ptItalic' },
    bold: { normal: 'DMSans-9ptBold', italic: 'DMSansItalic-9ptBoldItalic' },
} as const;

export const typography = {
    small: { fontSize: 12, lineHeight: 16 },
    regular: { fontSize: 16, lineHeight: 24 },
    large: { fontSize: 24, lineHeight: 32 },
} satisfies Record<string, TextStyle>;
