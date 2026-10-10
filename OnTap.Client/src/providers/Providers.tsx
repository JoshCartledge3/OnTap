import type {ReactNode} from "react";
import {AuthenticationProvider, PubsProvider, ThemeProvider} from './index';
import {authenticationSettings} from '../settings/authentication';

type Props =  {
    children: ReactNode;
}

export default function Providers ({ children }: Props) {
    return (
        <AuthenticationProvider domain={authenticationSettings.domain} clientId={authenticationSettings.clientId}>
            <ThemeProvider>
                <PubsProvider>
                    {children}
                </PubsProvider>
            </ThemeProvider>
        </AuthenticationProvider>
    )
}
