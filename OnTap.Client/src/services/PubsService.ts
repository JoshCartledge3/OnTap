import {onTapClient} from "../api/onTapClient";
import type {Coordinates} from "../types/Coordinates";
import type {MapBounds} from "../types/MapBounds";

export const pubsService = {
    getPubsAsync,
    getPubsInRangeAsync,
    getPubsInBoundsAsync
};

const client = onTapClient.pubsClient;

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