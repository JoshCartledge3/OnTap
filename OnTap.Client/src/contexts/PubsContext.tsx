import { createContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { PubSummaryDto } from '../api/generated/client';

type PubsContextValue = {
    pubs: PubSummaryDto[];
    setPubs: Dispatch<SetStateAction<PubSummaryDto[]>>;
    pubsInRange: PubSummaryDto[];
    setPubsInRange: Dispatch<SetStateAction<PubSummaryDto[]>>;
    pubsInBounds: PubSummaryDto[];
    setPubsInBounds: Dispatch<SetStateAction<PubSummaryDto[]>>;
};

export const PubsContext = createContext<PubsContextValue | undefined>(undefined);

export function PubsProvider({ children }: { children: ReactNode }) {
    const [pubs, setPubs] = useState<PubSummaryDto[]>([]);
    const [pubsInRange, setPubsInRange] = useState<PubSummaryDto[]>([]);
    const [pubsInBounds, setPubsInBounds] = useState<PubSummaryDto[]>([])

    return (
        <PubsContext value={{ pubs, pubsInRange, pubsInBounds, setPubs, setPubsInRange, setPubsInBounds }}>
            {children}
        </PubsContext>
    );
}
