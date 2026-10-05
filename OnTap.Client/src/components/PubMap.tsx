import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera, Map } from '@maplibre/maplibre-react-native';
import type { StyleSpecification } from '@maplibre/maplibre-react-native';
import mapStyle from '../assets/maps/ontap-map-style-light.json';
import { useLocation } from '../hooks/useLocation';
import UserLocationMarker from './UserLocationMarker';

export default function PubMap() {
    const { startLiveUserLocationAsync, liveLocation } = useLocation();
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapBearing, setMapBearing] = useState(0);
    const longitude = liveLocation?.longitude;
    const latitude = liveLocation?.latitude;
    const cameraCenter = useMemo<[number, number] | undefined>(() => {
        if (!mapLoaded || longitude == null || latitude == null) return undefined;
        return [longitude, latitude];
    }, [mapLoaded, longitude, latitude]);
    useEffect(() => {
        if (!mapLoaded) return;

        // Effects restart after Fast Refresh, even when the map stays loaded.
        void startLiveUserLocationAsync().catch(() => {
            // The service logs errors. Keep the default map position.
        });
    }, [mapLoaded, startLiveUserLocationAsync]);

    return (
        <View style={styles.container}>
            <Map
                style={StyleSheet.absoluteFill}
                mapStyle={mapStyle as StyleSpecification}
                logo={false}
                attribution={false}
                onDidFinishLoadingMap={() => setMapLoaded(true)}
                onRegionIsChanging={(event) => setMapBearing(event.nativeEvent.bearing)}
                onRegionDidChange={(event) => setMapBearing(event.nativeEvent.bearing)}
            >
                <Camera
                    center={cameraCenter}
                    zoom={15}
                    duration={1500}
                    easing="ease"
                />
                {liveLocation && (
                    <UserLocationMarker location={liveLocation} mapBearing={mapBearing}/>
                )}
            </Map>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
    },
});
