import {Animated, Pressable, StyleSheet} from 'react-native';
import {useEffect, useState} from 'react';
import type {BottomTabBarProps} from 'expo-router/js-tabs';
import {BlurView} from 'expo-blur';
import {ActivityIcon, HeartIcon, MapIcon, RouteIcon, SearchIcon, UserRoundIcon} from 'lucide-react-native';
import {GlassSurface} from './GlassSurface';
import {AppText} from '../typography/AppText';
import {useTheme} from '../../hooks';

const tabIcons: Record<string, typeof SearchIcon> = {
    index: MapIcon,
    'pub-runs': RouteIcon,
    saved: HeartIcon,
    activity: ActivityIcon,
    profile: UserRoundIcon,
};

export default function NavBar({state, descriptors, navigation}: BottomTabBarProps) {
    const {colors, colorScheme} = useTheme();
    const [barWidth, setBarWidth] = useState(0);
    const [highlightIndex] = useState(() => new Animated.Value(state.index));
    const tabWidth = Math.max(0, barWidth - 12) / state.routes.length;

    useEffect(() => {
        const animation = Animated.spring(highlightIndex, {
            toValue: state.index,
            stiffness: 260,
            damping: 24,
            mass: 0.8,
            useNativeDriver: true,
        });
        animation.start();
        return () => animation.stop();
    }, [highlightIndex, state.index]);

    return (
        <GlassSurface
            style={styles.container}
            onLayout={event => setBarWidth(event.nativeEvent.layout.width)}
        >
            {tabWidth > 0 && (
                <Animated.View
                    pointerEvents="none"
                    style={[
                        styles.selectedTab,
                        {
                            width: tabWidth,
                            backgroundColor: colorScheme === 'dark'
                                ? 'rgba(246, 242, 229, 0.18)'
                                : 'rgba(18, 51, 41, 0.14)',
                            borderColor: colorScheme === 'dark'
                                ? 'rgba(246, 242, 229, 0.3)'
                                : 'rgba(18, 51, 41, 0.25)',
                            transform: [{translateX: Animated.multiply(highlightIndex, tabWidth)}],
                        },
                    ]}
                >
                    <BlurView
                        intensity={45}
                        tint={colorScheme}
                        style={styles.highlightBlur}
                    />
                </Animated.View>
            )}
            {state.routes.map((route, index) => {
                const selected = state.index === index;
                const {options} = descriptors[route.key];
                const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title ?? route.name;
                const Icon = tabIcons[route.name] ?? SearchIcon;
                const color = selected ? colors.text : colors.textMuted;

                return (
                    <Pressable
                        key={route.key}
                        accessibilityRole="tab"
                        accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                        accessibilityState={{selected}}
                        testID={options.tabBarButtonTestID}
                        onPress={() => {
                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                                canPreventDefault: true,
                            });

                            if (!selected && !event.defaultPrevented) {
                                navigation.navigate(route.name, route.params);
                            }
                        }}
                        onLongPress={() => navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        })}
                        style={styles.tab}
                    >
                        <Icon size={24} color={color}/>
                        <AppText
                            variant="small"
                            weight={selected ? 'bold' : 'regular'}
                            numberOfLines={1}
                            style={[styles.label, {color}]}
                        >
                            {label}
                        </AppText>
                    </Pressable>
                );
            })}
        </GlassSurface>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
        height: 72,
        borderRadius: 36,
        padding: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tab: {
        flex: 1,
        height: '100%',
        borderRadius: 30,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    selectedTab: {
        position: 'absolute',
        left: 6,
        top: 6,
        bottom: 6,
        borderRadius: 30,
        borderWidth: 1,
        overflow: 'hidden',
    },
    highlightBlur: {
        ...StyleSheet.absoluteFill,
        opacity: 0.85,
    },
    label: {
        fontSize: 10,
        lineHeight: 14,
        textAlign: 'center',
    },
});
