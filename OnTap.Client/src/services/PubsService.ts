import {onTapClient} from "../api/onTapClient";
import type {Coordinates} from "../types/Coordinates";

export const pubsService = {
    getPubsAsync() {
        return onTapClient.pubsClient.getPubs();
    },

    getPubsInRangeAsync(currentLocation: Coordinates, radiusKilometres: number) {
        const radiusMetres = radiusKilometres * 1000;

        return onTapClient.pubsClient.getPubsInRange(
            currentLocation.latitude,
            currentLocation.longitude,
            radiusMetres
        );
    }
};