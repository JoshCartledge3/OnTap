import { useCallback, useEffect, useRef, useState } from 'react';
import type { UserLocation } from '../models';
import { locationService } from '../services/LocationService';

export function useLocation() {
    const [liveLocation, setLiveLocation] = useState<UserLocation | null>(null);
    const subscriptionRef = useRef<{ remove(): void } | null>(null);
    const trackingSessionRef = useRef<object | null>(null);

    async function getUserLocationSnapshotAsync(): Promise<UserLocation> {
        return locationService.getUserLocationSnapshotAsync();
    }

    const startLiveUserLocationAsync = useCallback(async () => {
        const trackingSession = {};
        trackingSessionRef.current = trackingSession;

        subscriptionRef.current?.remove();
        subscriptionRef.current = null;
        setLiveLocation(null);

        const subscription = await locationService.startLiveUserLocationAsync((location) => {
            if (trackingSessionRef.current === trackingSession) {
                setLiveLocation(location);
            }
        });

        // Remove tracking if it was replaced or the component unmounted.
        if (trackingSessionRef.current !== trackingSession) {
            subscription.remove();
            return;
        }

        subscriptionRef.current = subscription;
    }, []);

    useEffect(() => {
        return () => {
            trackingSessionRef.current = null;
            subscriptionRef.current?.remove();
            subscriptionRef.current = null;
        };
    }, []);

    return {
        startLiveUserLocationAsync,
        getUserLocationSnapshotAsync,
        liveLocation,
    };
}
