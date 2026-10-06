import { useMemo } from 'react';
import { GeoJSONSource, Images, Layer } from '@maplibre/maplibre-react-native';
import type { Feature, Point } from 'geojson';
import type { UserLocation } from '../../models';

const images = {
    'user-location-heading-cone': require('../../assets/maps/location-heading-cone.png'),
};

type UserLocationMarkerProps = {
    location: UserLocation;
};

export default function UserLocationMarker({ location }: UserLocationMarkerProps) {
    const { longitude, latitude, heading } = location;
    const point = useMemo<Feature<Point>>(() => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
        },
        properties: {},
    }), [longitude, latitude]);

    return (
        <>
            <Images images={images} />
            <GeoJSONSource id="user-location" data={point}>
                <Layer
                    id="user-location-heading"
                    type="symbol"
                    layout={{
                        'icon-image': 'user-location-heading-cone',
                        'icon-anchor': 'center',
                        'icon-rotate': heading ?? 0,
                        'icon-pitch-alignment': 'map',
                        'icon-rotation-alignment': 'map',
                        'icon-allow-overlap': true,
                        'icon-ignore-placement': true,
                        visibility: heading === null ? 'none' : 'visible',
                    }}
                />
                <Layer
                    id="user-location-halo"
                    type="circle"
                    afterId="user-location-heading"
                    paint={{
                        'circle-radius': 15,
                        'circle-color': 'rgba(37, 99, 235, 0.12)',
                        'circle-pitch-alignment': 'map',
                        'circle-pitch-scale': 'viewport',
                    }}
                />
                <Layer
                    id="user-location-dot"
                    type="circle"
                    afterId="user-location-halo"
                    paint={{
                        'circle-radius': 7,
                        'circle-color': '#2563eb',
                        'circle-stroke-width': 3,
                        'circle-stroke-color': '#ffffff',
                        'circle-pitch-alignment': 'map',
                        'circle-pitch-scale': 'viewport',
                    }}
                />
            </GeoJSONSource>
        </>
    );
}
