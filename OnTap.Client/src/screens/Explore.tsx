import { StyleSheet, View } from 'react-native';
import PubMap from '../components/map/PubMap';
import {SafeAreaView} from "react-native-safe-area-context";
import type { PubMapHandle, PubMapViewport } from '../components/map/PubMap';
import {RecenterButton} from "../components/explore/RecenterButton";
import {useRef, useState} from "react";
import {SwitchMapStyleButton} from "../components/explore/SwitchMapStyleButton";
import {MapStylePicker} from "../components/explore/MapStylePicker";
import type {MapStyleOption} from "../types/MapStyleOption";
import {usePubs} from "../hooks";
import PubList from "../components/explore/PubList";
import SearchBar from '../components/search/SearchBar';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';

export default function Explore() {
    const mapRef = useRef<PubMapHandle>(null);
    const [showMapStylePicker, setShowMapStylePicker] = useState(false);
    const [selectedMapStyle, setSelectedMapStyle] = useState<MapStyleOption>('ontap');
    const [mapViewport, setMapViewport] = useState<PubMapViewport>();
    const [searchText, setSearchText] = useState('');
    const {mapPoints, filteredPubsInBounds, getClusterExpansionZoom, getPubsInBoundsAsync,} =
        usePubs(mapViewport?.bounds, mapViewport?.zoom, searchText);

    function onViewportChanged(viewport: PubMapViewport) {
        setMapViewport(viewport);

        void getPubsInBoundsAsync(viewport.bounds).catch(() => {
            // The service logs errors. Keep the existing results.
        });
    }

    return (
        <View style={styles.container}>
            <PubMap
                ref={mapRef}
                mapStyle={selectedMapStyle}
                onViewportChanged={onViewportChanged}
                mapPoints={mapPoints}
                getClusterExpansionZoom={getClusterExpansionZoom}
            />
            <SafeAreaView pointerEvents="box-none" style={styles.overlay}>
                <View style={styles.controls}>
                    <RecenterButton onRecenter={() => mapRef.current?.recenter()}/>
                    <SwitchMapStyleButton onPress={() => setShowMapStylePicker(true)}/>
                </View>
            </SafeAreaView>
            <MapStylePicker
                visible={showMapStylePicker}
                onClose={() => setShowMapStylePicker(false)}
                selectedStyle={selectedMapStyle}
                onSelect={setSelectedMapStyle}
            />
            <PubList
                pubs={filteredPubsInBounds}
                header={collapse => (
                    <SearchBar
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitSearch={collapse}
                        placeholder="Search pubs nearby"
                        inputComponent={BottomSheetTextInput}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    overlay: {
        ...StyleSheet.absoluteFill,
        padding: 16
    },

    controls: {
        alignItems: 'flex-end',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
    },
});
