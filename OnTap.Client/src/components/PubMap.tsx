import { StyleSheet, View } from 'react-native';
import {Camera, CameraRef, Map, ViewAnnotation} from '@maplibre/maplibre-react-native';
import type { StyleSpecification } from '@maplibre/maplibre-react-native';
import mapStyle from '../assets/maps/ontap-map-style-light.json';
import { useLocation } from '../hooks/useLocation';
import {useRef, useState} from "react";

export default function PubMap() {

    const { getCurrentUserLocationAsync } = useLocation();
    const locationRequested = useRef(false);
    const mapCameraRef = useRef<CameraRef>(null);
    const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);

    async function onMapLoaded() {
        if (locationRequested.current) return;
        locationRequested.current = true;

        try {
            const location = await getCurrentUserLocationAsync();
            setUserCoordinates([location.longitude, location.latitude]);

            mapCameraRef.current?.easeTo({
                center: [location.longitude, location.latitude],
                zoom: 15,
                duration: 1500
            });
        } catch {
            // Load default map location
        }
    }

    return (
        <View style={styles.container}>
            <Map
                style={StyleSheet.absoluteFill}
                mapStyle={mapStyle as StyleSpecification}
                logo={false}
                attribution={false}
                onDidFinishLoadingMap={onMapLoaded}

            >
                <Camera ref={mapCameraRef} />
                {userCoordinates && (
                    <ViewAnnotation id="user-location" lngLat={userCoordinates}>
                        <View style={styles.locationMarker} />
                    </ViewAnnotation>
                )}
            </Map>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
    },

    locationMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#2563eb',
        borderWidth: 3,
        borderColor: '#ffffff',
    },
});
