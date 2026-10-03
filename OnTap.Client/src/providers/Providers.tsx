import type {ReactNode} from "react";
import {PubsProvider} from "../contexts/PubsContext";

type Props =  {
    children: ReactNode;
}

export default function Providers ({ children }: Props) {
    return (
        <PubsProvider>
            {children}
        </PubsProvider>
    )
}