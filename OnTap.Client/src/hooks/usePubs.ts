import {useContext, useEffect, useRef} from 'react';
import { PubsContext } from '../contexts/PubsContext';
import {pubsService} from "../services/PubsService";
import type {Coordinates} from "../types/Coordinates";

export { PubsProvider } from '../contexts/PubsContext';

export function usePubs() {
    const context = useContext(PubsContext);
    if (!context) {
        throw new Error('usePubs must be used within PubsProvider.');
    }
    const { pubs, pubsInRange, setPubs, setPubsInRange } = context;
    const nearbyController = useRef<AbortController | null>(null);
    useEffect(() => {
        return () => nearbyController.current?.abort();
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

    return { pubs, pubsInRange, getPubsAsync, getPubsInRangeAsync };
}
