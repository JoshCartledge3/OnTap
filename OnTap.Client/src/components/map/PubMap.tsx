import {useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react';
import type {Ref} from 'react';
import {StyleSheet, View} from 'react-native';
import type {NativeSyntheticEvent} from 'react-native';
import {Camera, Marker, Map} from '@maplibre/maplibre-react-native';
import type {CameraRef, MapRef, ViewStateChangeEvent} from '@maplibre/maplibre-react-native';
import {PubMarker} from './PubMarker';
import {PubCluster} from "./PubCluster";
import {useLocation, useTheme} from '../../hooks';
import UserLocationMarker from './UserLocationMarker';
import type {MapBounds} from '../../types/MapBounds';
import {pubMarkerPointerX} from './mapStyles';
import type {MapStyleOption} from "../../types/MapStyleOption";
import {getMapStyle} from "../../theme/mapStyles";
import type {ClusterFeature, PointFeature} from "supercluster";
import type {PubProperties} from "../../mappers/toGetJsonFeatureCollection";

export type PubMapHandle = {
    recenter: () => void;
}

export type PubMapViewport = {
    bounds: MapBounds;
    zoom: number;
}

type Props = {
    ref?: Ref<PubMapHandle>;
    mapStyle?: MapStyleOption;
    onViewportChanged: (viewport: PubMapViewport) => void;
    mapPoints: (ClusterFeature<unknown> | PointFeature<PubProperties>)[];
    getClusterExpansionZoom: (clusterId: number) => number;
};

export default function PubMap({
    ref,
    mapStyle = 'ontap',
    onViewportChanged,
    mapPoints,
    getClusterExpansionZoom,
}: Props) {
    const {mapTheme, colorScheme} = useTheme();
    //#region Location

    const {startLiveUserLocationAsync, liveLocation} = useLocation();
    const mapRef = useRef<MapRef>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const longitude = liveLocation?.longitude;
    const latitude = liveLocation?.latitude;
    const cameraRef = useRef<CameraRef>(null);
    const [selectedPubId, setSelectedPubId] = useState<string>();
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
        const [bounds, zoom] = await Promise.all([
            mapRef.current?.getBounds(),
            mapRef.current?.getZoom(),
        ]);

        if (bounds) {
            const viewport = {bounds, zoom: zoom ?? 15};
            onViewportChanged(viewport);
        }
    }

    function onMapBoundsChanged(event: NativeSyntheticEvent<ViewStateChangeEvent>) {
        const viewport = {
            bounds: event.nativeEvent.bounds,
            zoom: event.nativeEvent.zoom,
        };

        onViewportChanged(viewport);
    }

    function onMapStyleChanged() {
        void cameraRef.current?.setStop({
            pitch: 0,
            duration: 300,
            easing: 'ease',
        });
    }

    async function onRecenter() {
        if (!mapLoaded || !liveLocation) return;

        await cameraRef.current?.setStop({
            pitch: 0,
            duration: 0,
        });

        cameraRef.current?.flyTo({
            center: [liveLocation.longitude, liveLocation.latitude],
            zoom: 15,
            bearing: 0,
            duration: 500,
        });
    }

    useImperativeHandle(ref, () => ({
        recenter: onRecenter,
    }));

    //#endregion
    //#region Pubs

    function onPubPressed(pubId: string, lngLat: [number, number]) {
        setSelectedPubId(pubId);
        cameraRef.current?.easeTo({
            center: lngLat,
            duration: 500,
        });
    }

    //#endregion

    return (
        <View style={styles.container}>
            <Map
                ref={mapRef}
                style={StyleSheet.absoluteFill}
                mapStyle={getMapStyle(mapStyle, mapTheme, colorScheme)}
                logo={false}
                attribution={false}
                touchPitch={mapStyle !== 'topographic'}
                onDidFinishLoadingStyle={onMapStyleChanged}
                onDidFinishLoadingMap={() => {
                    void onMapLoaded().catch(() => {
                        // Need to catch, but do nothing.
                    });
                }}
                onRegionDidChange={onMapBoundsChanged}>
                <Camera
                    ref={cameraRef}
                    center={cameraCenter}
                    zoom={15}
                    bearing={0}
                    duration={1500}
                    easing="ease"/>
                {mapPoints.map(point => {
                    const properties = point.properties;
                    const [longitude, latitude] = point.geometry.coordinates;
                    const lngLat: [number, number] = [longitude, latitude];

                    if (properties.cluster) {
                        const id = `cluster-${properties.cluster_id}`;
                        return (
                            <Marker
                                key={id}
                                id={id}
                                lngLat={lngLat}
                                anchor="bottom-left"
                                offset={[-pubMarkerPointerX, 0]}
                                onPress={() => cameraRef.current?.easeTo({
                                    center: lngLat,
                                    zoom: getClusterExpansionZoom(properties.cluster_id),
                                    duration: 500,
                                })}
                            >
                                <PubCluster count={properties.point_count}/>
                            </Marker>
                        );
                    }

                    const pubId = String(point.id);
                    return (
                        <Marker
                            key={`pub-${pubId}`}
                            id={`pub-${pubId}`}
                            lngLat={lngLat}
                            anchor="bottom-left"
                            offset={[-pubMarkerPointerX, 0]}
                            onPress={() => onPubPressed(pubId, lngLat)}
                        >
                            <PubMarker rating={properties.rating} active={selectedPubId === pubId}/>
                        </Marker>
                    );
                })}
                {liveLocation && (
                    <UserLocationMarker location={liveLocation}/>
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
