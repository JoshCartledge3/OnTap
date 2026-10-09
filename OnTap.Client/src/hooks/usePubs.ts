import {useCallback, useContext, useEffect, useMemo, useRef} from 'react';
import { PubsContext } from '../contexts/PubsContext';
import {pubsService} from "../services/PubsService";
import type {Coordinates} from "../types/Coordinates";
import type {MapBounds} from "../types/MapBounds";
import type {MapViewport} from '../types/MapViewport';

const minimumPubMapZoom = 12;

export function usePubs(mapViewport?: MapViewport, searchText = '') {
    const mapBounds = mapViewport?.bounds;
    const mapZoom = mapViewport?.zoom ?? 15;
    const context = useContext(PubsContext);
    if (!context) {
        throw new Error('usePubs must be used within PubsProvider.');
    }
    const { pubs, pubsInRange, setPubs, setPubsInRange, pubsInBounds, setPubsInBounds } = context;
    const nearbyController = useRef<AbortController | null>(null);
    const inBoundsController = useRef<AbortController | null>(null);
    const loadedBounds = useRef<MapBounds | null>(null);
    const pendingBounds = useRef<MapBounds | null>(null);
    const searchedPubs = useMemo(
        () => pubsService.searchPubs(pubsInBounds, searchText),
        [pubsInBounds, searchText],
    );
    const filteredPubsInBounds = useMemo(
        () => mapBounds && mapZoom >= minimumPubMapZoom
            ? pubsService.filterPubsInBounds(searchedPubs, mapBounds) : [],
        [searchedPubs, mapBounds, mapZoom],
    );
    const clusterIndex = useMemo(
        () => pubsService.createMapClusterIndex(searchedPubs),
        [searchedPubs],
    );
    const mapPoints = useMemo(
        () => mapBounds && mapZoom >= minimumPubMapZoom
            ? pubsService.getMapPoints(clusterIndex, mapBounds, mapZoom) : [],
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
            inBoundsController.current = null;
            pendingBounds.current = null;
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

    useEffect(() => {
        if (!mapViewport) return;
        const {bounds, zoom} = mapViewport;

        async function getPubsInBoundsAsync() {
            if (zoom < minimumPubMapZoom) {
                inBoundsController.current?.abort();
                inBoundsController.current = null;
                pendingBounds.current = null;
                loadedBounds.current = null;
                setPubsInBounds(current => current.length ? [] : current);
                return;
            }

            if (pendingBounds.current && pubsService.containsMapBounds(pendingBounds.current, bounds)) return;

            inBoundsController.current?.abort();
            inBoundsController.current = null;
            pendingBounds.current = null;

            if (loadedBounds.current && pubsService.containsMapBounds(loadedBounds.current, bounds)) return;

            const requestBounds = pubsService.bufferMapBounds(bounds);
            const controller = new AbortController();
            inBoundsController.current = controller;
            pendingBounds.current = requestBounds;

            try {
                const result = await pubsService.getPubsInBoundsAsync(requestBounds, controller.signal);

                if (!controller.signal.aborted) {
                    loadedBounds.current = requestBounds;
                    setPubsInBounds(result);
                }
            } catch (error) {
                if (!controller.signal.aborted) {
                    throw error;
                }
            } finally {
                if (inBoundsController.current === controller) {
                    inBoundsController.current = null;
                    pendingBounds.current = null;
                }
            }
        }

        void getPubsInBoundsAsync().catch(() => {
            // The service logs errors. Keep the existing results.
        });
    }, [mapViewport, setPubsInBounds]);

    return {
        pubs,
        pubsInRange,
        pubsInBounds,
        filteredPubsInBounds,
        mapPoints,
        getClusterExpansionZoom,
        getPubsAsync,
        getPubsInRangeAsync,
    };
}
