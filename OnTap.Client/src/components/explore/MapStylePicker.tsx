import {ActivityIndicator, Image, Modal, Pressable, StyleSheet, View} from "react-native";
import type {ImageSourcePropType} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {GlassSurface} from "../layout/GlassSurface";
import {AppText} from "../typography/AppText";
import {CheckIcon, XIcon} from "lucide-react-native";
import {useTheme} from "../../hooks";
import {openURL} from "expo-linking";

import type {MapStyleOption} from "../../types/MapStyleOption";
import {useState} from "react";

type Props = {
    visible: boolean;
    onClose: () => void;
    selectedStyle: MapStyleOption;
    onSelect: (style: MapStyleOption) => void;
};

export function MapStylePicker({visible, onClose, selectedStyle, onSelect}: Props) {
    const {colors, colorScheme} = useTheme();
    const [loadingPreviews, setLoadingPreviews] = useState<Record<MapStyleOption, boolean>>({
        ontap: true,
        topographic: true,
    });
    const options: {id: MapStyleOption; label: string; image: ImageSourcePropType}[] = [
        {
            id: 'ontap',
            label: 'OnTap',
            image: colorScheme === 'dark'
                ? require('../../assets/maps/previews/ontap-map-dark-preview.png')
                : require('../../assets/maps/previews/ontap-map-light-preview.png'),
        },
        {
            id: 'topographic',
            label: 'Topographic',
            image: colorScheme === 'dark'
                ? require('../../assets/maps/previews/topographic-map-dark-preview.png')
                : require('../../assets/maps/previews/topographic-map-light-preview.png'),
        },
    ];
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
                <Pressable
                    style={styles.backdrop}
                    onPress={onClose}
                    accessibilityLabel={"Close map styles"}
                    accessibilityRole={"button"}
                />
                <GlassSurface style={styles.sheet}>
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <AppText variant="large" weight="bold">Map styles</AppText>
                            <Pressable
                                onPress={onClose}
                                style={styles.closeButton}
                                accessibilityRole="button"
                                accessibilityLabel="Close map styles"
                            >
                                <XIcon size={24} color={colors.text}/>
                            </Pressable>
                        </View>
                        <View style={styles.grid}>
                            {options.map(option => {
                                const selected = selectedStyle === option.id;
                                return (
                                    <Pressable
                                        key={option.id}
                                        style={styles.option}
                                        onPress={() => onSelect(option.id)}
                                        accessibilityRole="button"
                                        accessibilityLabel={option.label}
                                        accessibilityState={{selected}}
                                    >
                                        <View style={[
                                            styles.preview,
                                            {
                                                borderColor: selected ? colors.accent : colors.border,
                                                backgroundColor: colors.surfaceMuted,
                                            },
                                        ]}>
                                            <Image
                                                source={option.image}
                                                style={styles.previewImage}
                                                resizeMode="cover"
                                                onLoadStart={() => setLoadingPreviews(previous => ({...previous, [option.id]: true}))}
                                                onLoadEnd={() => setLoadingPreviews(previous => ({...previous, [option.id]: false}))}
                                            />
                                            {loadingPreviews[option.id] && (
                                                <View style={styles.previewLoading} pointerEvents="none">
                                                    <ActivityIndicator size="small" color={colors.textMuted}/>
                                                </View>
                                            )}
                                            {selected && (
                                                <View style={[styles.selectedBadge, {backgroundColor: colors.accent}]}>
                                                    <CheckIcon size={14} color={colors.onAccent}/>
                                                </View>
                                            )}
                                        </View>
                                        <AppText variant="small" weight={selected ? 'bold' : 'regular'} style={styles.label}>
                                            {option.label}
                                        </AppText>
                                    </Pressable>
                                );
                            })}
                        </View>
                        <View style={styles.attribution}>
                            <Pressable
                                accessibilityRole="link"
                                onPress={() => void openURL('https://openmaptiles.org/copyright/')}
                                style={styles.attributionLink}
                            >
                                <AppText variant="small" style={[styles.attributionText, {color: colors.textMuted}]}>
                                    © OpenMapTiles
                                </AppText>
                            </Pressable>
                            <Pressable
                                accessibilityRole="link"
                                onPress={() => void openURL('https://www.openstreetmap.org/copyright')}
                                style={styles.attributionLink}
                            >
                                <AppText variant="small" style={[styles.attributionText, {color: colors.textMuted}]}>
                                    © OpenStreetMap contributors
                                </AppText>
                            </Pressable>
                            <Pressable
                                accessibilityRole="link"
                                onPress={() => void openURL('https://www.maptoolkit.com/copyright/')}
                                style={styles.attributionLink}
                            >
                                <AppText variant="small" style={[styles.attributionText, {color: colors.textMuted}]}>
                                    © MapToolKit
                                </AppText>
                            </Pressable>
                        </View>
                    </View>
                </GlassSurface>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 12,
    },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(2, 18, 11, 0.3)',
    },
    sheet: {
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    content: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 18,
    },
    closeButton: {
        width: 44,
        height: 44,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        gap: 12,
    },
    option: {
        flex: 1,
        gap: 10,
        alignItems: 'center',
    },
    preview: {
        width: '100%',
        aspectRatio: 3/2,
        borderRadius: 18,
        borderWidth: 3,
        overflow: 'hidden',
    },
    selectedBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    previewLoading: {
        ...StyleSheet.absoluteFill,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        textAlign: 'center',
    },
    attribution: {
        marginTop: 24,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 10,
    },
    attributionLink: {
        paddingVertical: 6,
    },
    attributionText: {
        fontSize: 10,
        lineHeight: 16,
    },
});
