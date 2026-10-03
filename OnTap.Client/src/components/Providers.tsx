import type { ReactNode } from 'react';
import { PubsProvider } from '../hooks';

export default function Providers({ children }: { children: ReactNode }) {
    return <PubsProvider>{children}</PubsProvider>;
}
