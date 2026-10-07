import type {ReactNode, RefObject} from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import {GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable} from "expo-glass-effect";
import {BlurView} from "expo-blur";

type Props = {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    blurTarget?: RefObject<View | null>;
    interactive?: boolean;
}

export function GlassSurface({children, style, blurTarget, interactive}: Props) {
    const supportsGlass = Platform.OS === 'ios' && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

    if (supportsGlass) {
        return (
            <GlassView
                glassEffectStyle={"regular"}
                isInteractive={interactive}
                style={[styles.surface, style]}>
                {children}
            </GlassView>
        );
    }

    return (
        <BlurView
            intensity={20}
            tint={"default"}
            blurTarget={blurTarget}
            blurMethod={"dimezisBlurViewSdk31Plus"}
            style={[styles.surface, style]}>
            {children}
        </BlurView>
    )
}

const styles = StyleSheet.create({
    surface: {
        overflow: 'hidden',
    },
});