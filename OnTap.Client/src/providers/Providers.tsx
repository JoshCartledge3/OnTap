import type {ReactNode} from "react";
import {PubsProvider, ThemeProvider} from './index';

type Props =  {
    children: ReactNode;
}

export default function Providers ({ children }: Props) {
    return (
        <ThemeProvider>
            <PubsProvider>
                {children}
            </PubsProvider>
        </ThemeProvider>
    )
}