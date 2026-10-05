import type { FeatureCollection, Point } from 'geojson';
import type { PubDto } from '../api/generated/client';

type PubProperties = {
    name: string;
};

export function toGeoJsonFeatureCollection(pubs: readonly PubDto[]): FeatureCollection<Point, PubProperties> {
    return {
        type: 'FeatureCollection',
        features: pubs.map(pub => ({
            type: 'Feature',
            id: pub.id,
            geometry: {
                type: 'Point',
                coordinates: [pub.longitude, pub.latitude],
            },
            properties: {
                name: pub.name,
            },
        })),
    };
}