export type ThemeColors = {
    background: string;
    surface: string;
    surfaceMuted: string;
    text: string;
    textMuted: string;
    border: string;
    accent: string;
    onAccent: string;
    selectedControl: string;
    onSelectedControl: string;
};

export type Theme = {
    colors: ThemeColors;
};

export const lightTheme = {
    colors: {
        background: '#F6F3E9',
        surface: '#F6F3E9',
        surfaceMuted: '#E7EBDD',
        text: '#123329',
        textMuted: '#68786C',
        border: '#D7DCCE',
        accent: '#D5B063',
        onAccent: '#123329',
        selectedControl: '#123329',
        onSelectedControl: '#F6F2E5',
    },
} satisfies Theme;

export const darkTheme = {
    colors: {
        background: '#02120B',
        surface: '#061D12',
        surfaceMuted: '#0B281A',
        text: '#F6F2E5',
        textMuted: '#A4B7A9',
        border: '#1D3827',
        accent: '#D5B063',
        onAccent: '#02120B',
        selectedControl: '#0B281A',
        onSelectedControl: '#F6F2E5',
    },
} satisfies Theme;
