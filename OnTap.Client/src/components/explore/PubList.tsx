import {Keyboard, StyleSheet, View} from 'react-native';
import type {PubDto} from '../../api/generated/client';
import PubListItem from './PubListItem';
import BottomSheet, {BottomSheetFlatList, useBottomSheet} from '@gorhom/bottom-sheet';
import {useTheme} from '../../hooks';
import {useMemo, useState} from 'react';
import type {ReactNode} from 'react';
import Animated, {Extrapolation, interpolate, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
    pubs: readonly PubDto[];
    header: (collapse: () => void) => ReactNode;
};

export default function PubList({pubs, header}: Props) {
    const {colors} = useTheme();
    const insets = useSafeAreaInsets();
    const [headerHeight, setHeaderHeight] = useState(64);
    const snapPoints = useMemo(
        () => [sheetHandleHeight + headerHeight + insets.bottom, '45%', '100%'],
        [headerHeight, insets.bottom],
    );
    const [sheetIndex, setSheetIndex] = useState(0);
    const isCollapsed = sheetIndex === 0;
    const animatedIndex = useSharedValue(0);
    const sheetSpacingStyle = useAnimatedStyle(() => {
        const margin = interpolate(animatedIndex.value, [0, 1], [12, 0], Extrapolation.CLAMP);
        return {marginHorizontal: margin, marginBottom: margin};
    });
    const listOpacityStyle = useAnimatedStyle(() => ({
        opacity: interpolate(animatedIndex.value, [0, 1], [0, 1], Extrapolation.CLAMP),
    }));

    return (
        <Animated.View pointerEvents="box-none" style={[styles.sheetContainer, sheetSpacingStyle]}>
            <BottomSheet
                index={0}
                onChange={setSheetIndex}
                animatedIndex={animatedIndex}
                snapPoints={snapPoints}
                topInset={insets.top}
                enableDynamicSizing={false}
                enablePanDownToClose={false}
                backgroundStyle={[styles.sheetBackground, {backgroundColor: colors.surfaceRaised}]}
                handleIndicatorStyle={{backgroundColor: colors.textMuted}}
                enableContentPanningGesture={true}
                enableHandlePanningGesture={true}
            >
                <View
                    style={styles.header}
                    onLayout={event => setHeaderHeight(event.nativeEvent.layout.height)}
                >
                    <PubListHeader header={header}/>
                </View>
                <BottomSheetFlatList<PubDto>
                    style={[styles.list, listOpacityStyle]}
                    pointerEvents={isCollapsed ? 'none' : 'auto'}
                    data={pubs}
                    keyExtractor={pub => pub.id}
                    renderItem={({item}) => <PubListItem pub={item}/>}
                    ItemSeparatorComponent={Separator}
                    contentContainerStyle={styles.content}
                />
            </BottomSheet>
        </Animated.View>
    );
}

function PubListHeader({header}: Pick<Props, 'header'>) {
    const {collapse} = useBottomSheet();

    function onCollapse() {
        Keyboard.dismiss();
        collapse();
    }

    return header(onCollapse);
}

function Separator() {
    return <View style={styles.separator}/>;
}

const sheetBorderRadius = 40;
const sheetHandleHeight = 24;

const styles = StyleSheet.create({
    sheetContainer: {
        ...StyleSheet.absoluteFill,
        borderBottomLeftRadius: sheetBorderRadius,
        borderBottomRightRadius: sheetBorderRadius,
        overflow: 'hidden',
    },
    sheetBackground: {
        borderRadius: sheetBorderRadius,
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    content: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    separator: {
        height: 16,
    },
    list: {
        flex: 1
    },
});
