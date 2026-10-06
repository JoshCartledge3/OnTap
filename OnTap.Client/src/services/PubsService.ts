import {onTapClient} from "../api/onTapClient";
import type {Coordinates} from "../types/Coordinates";
import type {MapBounds} from "../types/MapBounds";
import Supercluster from 'supercluster';
import type { PubDto } from '../api/generated/client';
import { toGeoJsonFeatureCollection } from '../mappers/toGetJsonFeatureCollection';
import type { PubProperties } from '../mappers/toGetJsonFeatureCollection';

export const pubsService = {
    getPubsAsync,
    getPubsInRangeAsync,
    getPubsInBoundsAsync,
    createMapClusterIndex,
    getMapPoints,
    getClusterExpansionZoom,
};

const client = onTapClient.pubsClient;

function createMapClusterIndex(pubs: readonly PubDto[]) {
    return new Supercluster<PubProperties>({ radius: 50, maxZoom: 16 })
        .load(toGeoJsonFeatureCollection(pubs).features);
}

function getMapPoints(index: Supercluster<PubProperties>, bounds: MapBounds, zoom: number) {
    return index.getClusters(bounds, Math.floor(zoom));
}

function getClusterExpansionZoom(index: Supercluster<PubProperties>, clusterId: number) {
    return index.getClusterExpansionZoom(clusterId);
}

async function getPubsAsync() {
    try {
        return await client.getPubs();
    } catch (error) {
        console.error('[PubsService] Loading pubs failed.', error);
        throw error;
    }
}

async function getPubsInRangeAsync(currentLocation: Coordinates, radiusKilometres: number, signal?: AbortSignal) {
    const radiusMetres = radiusKilometres * 1000;

    try {
        return await client.getPubsInRange(
            currentLocation.latitude,
            currentLocation.longitude,
            radiusMetres,
            signal
        );
    } catch (error) {
        if (!signal?.aborted) {
            console.error('[PubsService] Loading nearby pubs failed.', error);
        }
        throw error;
    }
}

async function getPubsInBoundsAsync(bounds: MapBounds, signal?: AbortSignal) {
    const [west, south, east, north] = bounds;

    try {
        return await client.getPubsInBounds(
            west,
            south,
            east,
            north,
            signal
        );
    }
    catch (error) {
        if (!signal?.aborted) {
            console.error('[PubsService] Loading pubs in bounds failed.', error);
        }
        throw error;
    }
}