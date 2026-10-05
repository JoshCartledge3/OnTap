import { useEffect, useMemo, useRef, useState } from 'react';
import {StyleSheet, View} from 'react-native';
import type {NativeSyntheticEvent} from 'react-native';
import {Camera, GeoJSONSource, Layer, Map} from '@maplibre/maplibre-react-native';
import type { MapRef, StyleSpecification, ViewStateChangeEvent } from '@maplibre/maplibre-react-native';
import mapStyle from '../assets/maps/ontap-map-style-light.json';
import { useLocation } from '../hooks/useLocation';
import UserLocationMarker from './UserLocationMarker';
import {usePubs} from "../hooks";
import {toGeoJsonFeatureCollection} from "../mappers/toGetJsonFeatureCollection";

export default function PubMap() {
    //#region Location

    const { startLiveUserLocationAsync, liveLocation } = useLocation();
    const mapRef = useRef<MapRef>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapBearing, setMapBearing] = useState(0);
    const longitude = liveLocation?.longitude;
    const latitude = liveLocation?.latitude;
    const cameraCenter = useMemo<[number, number] | undefined>(() => {
        if (!mapLoaded || longitude == null || latitude == null) return undefined;
        return [longitude, latitude];
    }, [mapLoaded, longitude, latitude]);

    useEffect(() => {
        if (!mapLoaded)
            return;
        // Effects restart after Fast Refresh, even when the map stays loaded.
        void startLiveUserLocationAsync().catch(() => {
            // The service logs errors. Keep the default map position.
        });
    }, [mapLoaded, startLiveUserLocationAsync]);

    async function onMapLoaded() {
        setMapLoaded(true);

        const bounds = await mapRef.current?.getBounds();
        if (bounds) {
            await getPubsInBoundsAsync(bounds);
        }
    }

    async function onMapBoundsChanged(event: NativeSyntheticEvent<ViewStateChangeEvent>) {
        setMapBearing(event.nativeEvent.bearing);
        await getPubsInBoundsAsync(event.nativeEvent.bounds);
    }

    //#endregion
    //#region Pubs

    const {pubsInBounds, getPubsInBoundsAsync} = usePubs();
    const pubGeoJson = useMemo(
        () => toGeoJsonFeatureCollection(pubsInBounds),
        [pubsInBounds],
    );

    //#endregion

    return (
        <View style={styles.container}>
            <Map
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                mapStyle={mapStyle as StyleSpecification}
                logo={false}
                attribution={false}
                onDidFinishLoadingMap={() => {
                    void onMapLoaded().catch(() => {
                        // Need to catch, but do nothing.
                    });
                }}
                onRegionIsChanging={(event) => setMapBearing(event.nativeEvent.bearing)}
                onRegionDidChange={(event) => {
                    void onMapBoundsChanged(event).catch(() => {
                        // Need to catch, but do nothing.
                    });
                }}>
                <Camera
                    center={cameraCenter}
                    zoom={15}
                    duration={1500}
                    easing="ease"/>
                <GeoJSONSource id="pubs" data={pubGeoJson}>
                    <Layer
                        id="pub-points"
                        type="circle"
                        paint={{
                            'circle-radius': 6,
                            'circle-color': '#e87924',
                        }}
                    />
                </GeoJSONSource>
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
