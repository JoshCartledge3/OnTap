import {useEffect, useState} from 'react';
import {useAuth0} from 'react-native-auth0';
import {authenticationService} from '../services/AuthenticationService';

export function useAuthentication(initialize = false) {
    const {authorize, clearSession, getCredentials, user, isLoading} = useAuth0();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const authSubject = user?.sub;

    useEffect(() => {
        if (!initialize || isLoading) return;

        authenticationService.configureApiAuthentication(authSubject ? getCredentials : null);
        const controller = new AbortController();

        if (authSubject) {
            void authenticationService.getOrCreateCurrentUserAsync(controller.signal)
                .catch(() => {
                    // The service logs the failure.
                });
        }

        return () => {
            controller.abort();
            authenticationService.configureApiAuthentication(null);
        };
    }, [initialize, isLoading, authSubject, getCredentials]);

    async function signInAsync() {
        setIsAuthenticating(true);
        setErrorMessage(null);
        try {
            await authenticationService.signInAsync(authorize);
        } catch (error) {
            if (!authenticationService.isCancelled(error)) {
                setErrorMessage('Unable to sign in. Please try again.');
                throw error;
            }
        } finally {
            setIsAuthenticating(false);
        }
    }

    async function signOutAsync() {
        setIsAuthenticating(true);
        setErrorMessage(null);
        try {
            await authenticationService.signOutAsync(clearSession);
        } catch (error) {
            if (!authenticationService.isCancelled(error)) {
                setErrorMessage('Unable to sign out. Please try again.');
                throw error;
            }
        } finally {
            setIsAuthenticating(false);
        }
    }

    return {user, isLoading: isLoading || isAuthenticating, errorMessage, signInAsync, signOutAsync};
}
