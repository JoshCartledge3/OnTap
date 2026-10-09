import {onTapClient} from "../api/onTapClient";
import type {Coordinates} from "../types/Coordinates";
import type {MapBounds} from "../types/MapBounds";
import Supercluster from 'supercluster';
import type { PubSummaryDto } from '../api/generated/client';
import { toGeoJsonFeatureCollection } from '../mappers/toGetJsonFeatureCollection';
import type { PubProperties } from '../mappers/toGetJsonFeatureCollection';

export const pubsService = {
    getPubsAsync,
    getPubsInRangeAsync,
    getPubsInBoundsAsync,
    searchPubs,
    createMapClusterIndex,
    getMapPoints,
    getClusterExpansionZoom,
    containsMapBounds,
    bufferMapBounds,
    filterPubsInBounds,
};

const client = onTapClient.pubsClient;

function containsMapBounds(outer: MapBounds, inner: MapBounds): boolean {
    return outer[0] <= inner[0] && outer[1] <= inner[1]
        && outer[2] >= inner[2] && outer[3] >= inner[3];
}

function bufferMapBounds([west, south, east, north]: MapBounds): MapBounds {
    const longitudeMargin = (east - west) * 0.25;
    const latitudeMargin = (north - south) * 0.25;
    return [
        Math.max(-180, west - longitudeMargin),
        Math.max(-90, south - latitudeMargin),
        Math.min(180, east + longitudeMargin),
        Math.min(90, north + latitudeMargin),
    ];
}

function filterPubsInBounds(pubs: readonly PubSummaryDto[], [west, south, east, north]: MapBounds) {
    return pubs.filter(pub => pub.longitude >= west && pub.longitude <= east
        && pub.latitude >= south && pub.latitude <= north);
}

function searchPubs(pubs: readonly PubSummaryDto[], searchText: string): readonly PubSummaryDto[] {
    const query = searchText.trim().toLowerCase();
    if (!query) return pubs;

    return pubs.filter(pub => [pub.name, pub.address]
        .some(value => value?.toLowerCase().includes(query)));
}

function createMapClusterIndex(pubs: readonly PubSummaryDto[]) {
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
