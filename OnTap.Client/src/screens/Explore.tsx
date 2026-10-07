import { StyleSheet, View } from 'react-native';
import PubMap from '../components/map/PubMap';
import {SafeAreaView} from "react-native-safe-area-context";
import type { PubMapHandle } from '../components/map/PubMap';
import {Recenter} from "../components/map/Recenter";
import {useRef} from "react";
import {MapLayers} from "../components/map/MapLayers";

export default function Explore() {
    const mapRef = useRef<PubMapHandle>(null);

    return (
        <View style={styles.container}>
            <PubMap ref={mapRef}/>
            <SafeAreaView pointerEvents="box-none" style={styles.overlay}>
                <View style={styles.controls}>
                    <Recenter onRecenter={() => mapRef.current?.recenter()}/>
                    <MapLayers/>
                </View>
            </SafeAreaView>
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