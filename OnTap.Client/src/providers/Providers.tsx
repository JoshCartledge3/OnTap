import type {ReactNode} from "react";
import {AuthenticationProvider, PubsProvider, ThemeProvider} from './index';
import {authenticationSettings} from '../settings/authentication';
import AuthenticationInitializer from './AuthenticationInitializer';

type Props =  {
    children: ReactNode;
}

export default function Providers ({ children }: Props) {
    return (
        <AuthenticationProvider useDPoP={false} domain={authenticationSettings.domain} clientId={authenticationSettings.clientId}>
            <AuthenticationInitializer />
            <ThemeProvider>
                <PubsProvider>
                    {children}
                </PubsProvider>
            </ThemeProvider>
        </AuthenticationProvider>
    )
}
