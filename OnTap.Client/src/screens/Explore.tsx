import { StyleSheet, View } from 'react-native';
import PubMap from '../components/map/PubMap';
import {SafeAreaView} from "react-native-safe-area-context";
import type { PubMapHandle } from '../components/map/PubMap';
import {RecenterButton} from "../components/explore/RecenterButton";
import {useRef, useState} from "react";
import {SwitchMapStyleButton} from "../components/explore/SwitchMapStyleButton";
import {MapStylePicker} from "../components/explore/MapStylePicker";
import type {MapStyleOption} from "../types/MapStyleOption";

export default function Explore() {
    const mapRef = useRef<PubMapHandle>(null);
    const [showMapStylePicker, setShowMapStylePicker] = useState(false);
    const [selectedMapStyle, setSelectedMapStyle] = useState<MapStyleOption>('ontap');

    return (
        <View style={styles.container}>
            <PubMap ref={mapRef} mapStyle={selectedMapStyle}/>
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
