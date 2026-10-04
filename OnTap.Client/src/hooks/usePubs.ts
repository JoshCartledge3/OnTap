import {useContext, useRef} from 'react';
import { PubsContext } from '../contexts/PubsContext';
import {pubsService} from "../services/PubsService";
import type {Coordinates} from "../types/Coordinates";
const lastPubsInRangeRequest = useRef(0);

export { PubsProvider } from '../contexts/PubsContext';

export function usePubs() {
    const context = useContext(PubsContext);
    if (!context) {
        throw new Error('usePubs must be used within PubsProvider.');
    }
    const { pubs, pubsInRange, setPubs, setPubsInRange } = context;

    async function getPubsAsync() {
        const result = await pubsService.getPubsAsync();
        setPubs(result);
    }

    async function getPubsInRangeAsync(currentLocation: Coordinates, radiusKilometres: number) {
        const result = await pubsService.getPubsInRangeAsync(currentLocation, radiusKilometres);
        setPubsInRange(result);
    }

    return { pubs, pubsInRange, getPubsAsync, getPubsInRangeAsync };
}
