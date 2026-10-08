import {useCallback, useContext, useEffect, useMemo, useRef} from 'react';
import { PubsContext } from '../contexts/PubsContext';
import {pubsService} from "../services/PubsService";
import type {Coordinates} from "../types/Coordinates";
import type {MapBounds} from "../types/MapBounds";

export function usePubs(mapBounds?: MapBounds, mapZoom = 15, searchText = '') {
    const context = useContext(PubsContext);
    if (!context) {
        throw new Error('usePubs must be used within PubsProvider.');
    }
    const { pubs, pubsInRange, setPubs, setPubsInRange, pubsInBounds, setPubsInBounds } = context;
    const nearbyController = useRef<AbortController | null>(null);
    const inBoundsController = useRef<AbortController | null>(null);
    const filteredPubsInBounds = useMemo(
        () => pubsService.searchPubs(pubsInBounds, searchText),
        [pubsInBounds, searchText],
    );
    const clusterIndex = useMemo(
        () => pubsService.createMapClusterIndex(filteredPubsInBounds),
        [filteredPubsInBounds],
    );
    const mapPoints = useMemo(
        () => mapBounds ? pubsService.getMapPoints(clusterIndex, mapBounds, mapZoom) : [],
        [clusterIndex, mapBounds, mapZoom],
    );
    const getClusterExpansionZoom = useCallback(
        (clusterId: number) => pubsService.getClusterExpansionZoom(clusterIndex, clusterId),
        [clusterIndex],
    );
    useEffect(() => {
        return () => {
            nearbyController.current?.abort();
            inBoundsController.current?.abort();
        };
    }, []);

    async function getPubsAsync() {
        const result = await pubsService.getPubsAsync();
        setPubs(result);
    }

    async function getPubsInRangeAsync(currentLocation: Coordinates, radiusKilometres: number) {
        nearbyController.current?.abort();
        const controller = new AbortController();
        nearbyController.current = controller;

        try {
            const result = await pubsService.getPubsInRangeAsync(currentLocation, radiusKilometres, controller.signal);

            if (!controller.signal.aborted) {
                setPubsInRange(result)
            }
        }
        catch (error) {
            if (!controller.signal.aborted) {
                throw error;
            }
        }
        finally {
            if (nearbyController.current === controller) {
                nearbyController.current = null;
            }
        }
    }

    async function getPubsInBoundsAsync(bounds: MapBounds) {
        inBoundsController.current?.abort();
        const controller = new AbortController();
        inBoundsController.current = controller;

        try {
            const result = await pubsService.getPubsInBoundsAsync(bounds, controller.signal);

            if (!controller.signal.aborted) {
                setPubsInBounds(result)
            }
        } catch (error) {
            if (!controller.signal.aborted) {
                throw error;
            }
        } finally {
            if (inBoundsController.current === controller) {
                inBoundsController.current = null;
            }
        }
    }

    return {
        pubs,
        pubsInRange,
        pubsInBounds,
        filteredPubsInBounds,
        mapPoints,
        getClusterExpansionZoom,
        getPubsAsync,
        getPubsInRangeAsync,
        getPubsInBoundsAsync
    };
}
