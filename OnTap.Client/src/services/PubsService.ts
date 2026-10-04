import {onTapClient} from "../api/onTapClient";
import type {Coordinates} from "../types/Coordinates";

export const pubsService = {
    async getPubsAsync() {
        try {
            return await onTapClient.pubsClient.getPubs();
        } catch (error) {
            console.error('[PubsService] Loading pubs failed.', error);
            throw error;
        }
    },

    async getPubsInRangeAsync(currentLocation: Coordinates, radiusKilometres: number, signal?: AbortSignal) {
        const radiusMetres = radiusKilometres * 1000;

        try {
            return await onTapClient.pubsClient.getPubsInRange(
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
};