import type { FeatureCollection, Point } from 'geojson';
import type { PubSummaryDto } from '../api/generated/client';

export type PubProperties = {
    name: string;
    rating: number | null;
    cluster?: false;
};

export function toGeoJsonFeatureCollection(pubs: readonly PubSummaryDto[]): FeatureCollection<Point, PubProperties> {
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
                // The API does not return ratings yet.
                rating: null,
            },
        })),
    };
}