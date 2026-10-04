import { createContext, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { PubDto } from '../api/generated/client';

type PubsContextValue = {
    pubs: PubDto[];
    setPubs: Dispatch<SetStateAction<PubDto[]>>;
    pubsInRange: PubDto[];
    setPubsInRange: Dispatch<SetStateAction<PubDto[]>>;
};

export const PubsContext = createContext<PubsContextValue | undefined>(undefined);

export function PubsProvider({ children }: { children: ReactNode }) {
    const [pubs, setPubs] = useState<PubDto[]>([]);
    const [pubsInRange, setPubsInRange] = useState<PubDto[]>([]);

    return (
        <PubsContext value={{ pubs, pubsInRange, setPubs, setPubsInRange }}>
            {children}
        </PubsContext>
    );
}
