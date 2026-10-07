import { Platform, Text } from 'react-native';
import type { TextProps, TextStyle } from 'react-native';
import { useTheme } from '../../hooks';
import { fontFamily, fontWeights, iosFontFaces, typography } from '../../theme/typography';

type Props = TextProps & {
    variant?: keyof typeof typography;
    weight?: keyof typeof fontWeights;
    italic?: boolean;
};

export function AppText({ variant = 'regular', weight = 'regular', italic = false, style, ...props }: Props) {
    const { colors } = useTheme();
    const fontStyle = italic ? 'italic' : 'normal';
    const font: TextStyle = Platform.OS === 'ios'
        ? { fontFamily: iosFontFaces[weight][fontStyle], fontStyle }
        : { fontFamily, fontWeight: fontWeights[weight], fontStyle };

    return (
        <Text
            {...props}
            style={[typography[variant], font, { color: colors.text }, style]}
        />
    );
}
