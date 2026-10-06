import Svg, { G, Path, Line, Text } from 'react-native-svg';
import { useTheme } from '../../hooks';
import { createMapStyles, pubMarkerScale } from './mapStyles';

type Props = {
    label?: string;
    active?: boolean;
    rating?: boolean;
    accessibilityLabel: string;
};

export function PubMarkerArtwork({ label, active = false, rating = false, accessibilityLabel }: Props) {
    const { colors } = useTheme();
    const styles = createMapStyles(colors, active);
    const fontSize = 64;
    const labelX = rating ? 272 : 188;
    // Numeric glyph advances in Arial; the decimal is narrower than a digit.
    const labelWidth = label === undefined ? 0 : [...label].reduce(
        (width, character) => width + fontSize * (character === '.' ? 0.278 : 0.556),
        0,
    );
    const width = label === undefined ? 160.17 : labelX + labelWidth + 48;
    const height = 200.88;
    const body = `M80.085 4 H${width - 80.085}
        A76.085 76.085 0 0 1 ${width - 4} 80.085
        A76.085 76.085 0 0 1 ${width - 80.085} 156.17
        H113 L80.085 196.88 L48 151
        C21 138 4 111 4 80.085
        A76.085 76.085 0 0 1 80.085 4 Z`;

    return (
        <Svg
            width={width * pubMarkerScale}
            height={height * pubMarkerScale}
            viewBox={`0 0 ${width} ${height}`}
            accessible
            accessibilityLabel={accessibilityLabel}
        >
            {label === undefined ? (
                <>
                    <Path fill={styles.border} d={compactOutline} />
                    <Path fill={styles.background} d={compactInterior} />
                </>
            ) : (
                <Path
                    d={body}
                    fill={styles.background}
                    stroke={styles.border}
                    strokeWidth={7.5}
                    strokeLinejoin="round"
                />
            )}
            <G fill={styles.foreground}>
                {beerPaths.map((d, index) => <Path key={index} d={d} />)}
            </G>
            {label !== undefined && (
                <>
                    <Line x1={160} y1={40} x2={160} y2={120} stroke={styles.divider} strokeWidth={5} opacity={active ? 0.3 : 1} />
                    {rating && (
                        <Path
                            d="M220 48 L229.4 67.1 L250.5 70.1 L235.3 85 L238.9 106 L220 96.1 L201.1 106 L204.7 85 L189.5 70.1 L210.6 67.1 Z"
                            fill={styles.foreground}
                        />
                    )}
                    <Text
                        x={labelX}
                        y={104}
                        fill={styles.foreground}
                        fontSize={fontSize}
                        fontWeight="700"
                        fontFamily="Arial"
                    >
                        {label}
                    </Text>
                </>
            )}
        </Svg>
    );
}

// Original compact marker and beer paths supplied by the user.
const compactOutline = 'M83.66,198.59c-.77,1.15-2.02,2.06-2.8,2.25-.89.22-3.15-.43-3.73-1.3l-30.28-45.4C4.49,134.03-12.78,82.17,10.27,40.89,33.39-.55,87.13-12.6,126.08,14.51c21.67,15.09,35.05,40.79,34.04,68.39-1.12,30.48-18.96,58.14-46.79,71.21l-29.66,44.48ZM107.78,148.8l9.54-5.47c21.43-13.17,34.37-35.89,35.23-60.87,1.14-32.77-20.18-62.15-50.72-71.58C69.67.95,35.3,13.92,18.01,42.62c-22.97,38.14-6.45,87.77,34.05,105.62l28.05,42.05,27.67-41.49Z';
const compactInterior = 'M101.83,10.88C69.67.95,35.3,13.92,18.01,42.62c-22.97,38.14-6.45,87.77,34.05,105.62l28.05,42.05,27.67-41.49,9.54-5.47c21.43-13.17,34.37-35.89,35.23-60.87,1.14-32.77-20.18-62.15-50.72-71.58Z';
const beerPaths = [
    'M108.96,71.83v-5.53c4.83-2.31,8.19-7.2,8.19-12.9,0-7.9-6.43-14.33-14.33-14.33-2.12,0-4.02.59-5.69,1.11-1.54.48-3,.93-4.54.94-.36-.08-1.35-.95-2-1.53-2.07-1.84-5.19-4.61-10.3-4.61s-8.36,2.81-10.48,4.67c-.62.55-1.57,1.37-1.8,1.47-1.38,0-2.84-.44-4.38-.91-1.83-.56-3.73-1.13-5.86-1.13-7.9,0-14.33,6.43-14.33,14.33,0,5.7,3.37,10.59,8.19,12.9v46.49c0,6.78,5.51,12.29,12.29,12.29h32.77c6.78,0,12.29-5.51,12.29-12.29v-8.19c9.04,0,16.38-7.35,16.38-16.38s-7.35-16.38-16.38-16.38ZM57.77,47.26c.92,0,2.16.38,3.48.78,1.95.59,4.17,1.27,6.76,1.27,3.2,0,5.42-1.94,7.2-3.5,1.88-1.64,3.13-2.65,5.09-2.65s3.03.92,4.86,2.55c1.8,1.6,4.05,3.6,7.43,3.6,2.8,0,5.12-.72,6.98-1.31,1.28-.4,2.38-.74,3.26-.74,3.39,0,6.14,2.76,6.14,6.14s-2.76,6.14-6.14,6.14c-.87,0-1.98-.34-3.26-.74-1.86-.58-4.18-1.31-6.98-1.31-2.42,0-4.25.54-5.87,1.02-1.78.53-3.46,1.02-6.42,1.02s-4.64-.5-6.42-1.02c-1.62-.48-3.46-1.02-5.87-1.02-2.8,0-5.12.72-6.98,1.3-1.28.4-2.38.74-3.26.74-3.39,0-6.14-2.76-6.14-6.14s2.76-6.14,6.14-6.14ZM100.77,112.79c0,2.26-1.84,4.1-4.1,4.1h-32.77c-2.26,0-4.1-1.84-4.1-4.1v-45.3c1.3-.22,2.54-.52,3.65-.87,1.54-.48,2.99-.93,4.54-.93,1.23,0,2.15.27,3.55.69,2.05.61,4.6,1.36,8.74,1.36s6.7-.76,8.74-1.36c1.4-.41,2.32-.69,3.54-.69,1.55,0,3.01.45,4.55.93,1.1.34,2.34.65,3.64.87v45.3ZM108.96,96.41v-16.38c4.52,0,8.19,3.67,8.19,8.19s-3.68,8.19-8.19,8.19Z',
    'M72.1,75.93c-2.26,0-4.1,1.83-4.1,4.1v24.57c0,2.26,1.83,4.1,4.1,4.1s4.1-1.83,4.1-4.1v-24.57c0-2.26-1.83-4.1-4.1-4.1Z',
    'M88.49,75.93c-2.26,0-4.1,1.83-4.1,4.1v24.57c0,2.26,1.83,4.1,4.1,4.1s4.1-1.83,4.1-4.1v-24.57c0-2.26-1.83-4.1-4.1-4.1Z',
];
