import * as Location from 'expo-location';
import type { UserLocation } from '../models';

export const locationService = {
    requestLocationPermissionAsync,
    getUserLocationSnapshotAsync,
    startLiveUserLocationAsync,
};

async function requestLocationPermissionAsync(): Promise<void> {
    try {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!permission.granted) {
            throw new Error('Location permission was denied.');
        }
    } catch (error) {
        console.error('[LocationService] Requesting location permission failed.', error);
        throw error;
    }
}

async function getUserLocationSnapshotAsync(): Promise<UserLocation> {
    await requestLocationPermissionAsync();

    try {
        const {coords} = await Location.getCurrentPositionAsync({});
        let heading: number | null = null;

        try {
            const result = await Location.getHeadingAsync();
            const value = result.trueHeading >= 0
                ? result.trueHeading
                : result.magHeading;

            if (result.accuracy >= 2 && Number.isFinite(value) && value >= 0 && value < 360) {
                heading = value;
            }
        } catch (error) {
            console.error('[LocationService] Getting heading failed.', error);
        }

        return {
            latitude: coords.latitude,
            longitude: coords.longitude,
            heading,
        };
    } catch (error) {
        console.error('[LocationService] Getting current location failed.', error);
        throw error;
    }
}

async function startLiveUserLocationAsync(
    onUpdate: (location: UserLocation) => void,
): Promise<Location.LocationSubscription> {
    await requestLocationPermissionAsync();

    let positionSubscription: Location.LocationSubscription | null = null;
    let headingSubscription: Location.LocationSubscription | null = null;
    let coordinates: Pick<UserLocation, 'latitude' | 'longitude'> | null = null;
    let heading: number | null = null;
    let stopped = false;

    function publishUpdate() {
        if (stopped || !coordinates) return;
        onUpdate({ ...coordinates, heading });
    }

    function remove() {
        stopped = true;
        positionSubscription?.remove();
        headingSubscription?.remove();
    }

    try {
        positionSubscription = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.Balanced,
                distanceInterval: 5,
            },
            ({ coords }) => {
                coordinates = {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                };
                publishUpdate();
            },
            (error) => {
                console.error('[LocationService] Live location update failed.', error);
            },
        );

        try {
            headingSubscription = await Location.watchHeadingAsync(
                (result) => {
                    // Low-accuracy compass readings can be off by roughly 50 degrees.
                    if (result.accuracy < 2) {
                        if (heading !== null) {
                            heading = null;
                            publishUpdate();
                        }
                        return;
                    }

                    const nextHeading = result.trueHeading >= 0
                        ? result.trueHeading
                        : result.magHeading;

                    if (!Number.isFinite(nextHeading) || nextHeading < 0 || nextHeading >= 360) {
                        return;
                    }

                    if (heading !== null) {
                        const difference = Math.abs(nextHeading - heading);
                        const angleChange = Math.min(difference, 360 - difference);
                        if (angleChange < 5) return;
                    }

                    heading = nextHeading;
                    publishUpdate();
                },
                (error) => {
                    console.error('[LocationService] Live heading update failed.', error);
                },
            );
        } catch (error) {
            // Coordinates continue updating if heading is unavailable.
            console.error('[LocationService] Starting live heading failed.', error);
        }

        return { remove };
    } catch (error) {
        remove();
        console.error('[LocationService] Starting live location failed.', error);
        throw error;
    }
}
