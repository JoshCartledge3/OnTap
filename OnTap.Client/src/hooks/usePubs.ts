import { useContext } from 'react';
import { PubsContext } from '../contexts/PubsContext';
import {pubsService} from "../services/PubsService";

export { PubsProvider } from '../contexts/PubsContext';

export function usePubs() {
    const context = useContext(PubsContext);
    if (!context) {
        throw new Error('usePubs must be used within PubsProvider.');
    }
    const { pubs, setPubs } = context;

    async function getPubsAsync() {
        const result = await pubsService.getPubsAsync();
        setPubs(result);
    }

    return { pubs, getPubsAsync };
}
