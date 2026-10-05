import type {ReactNode} from "react";
import {PubsProvider} from "../hooks";

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