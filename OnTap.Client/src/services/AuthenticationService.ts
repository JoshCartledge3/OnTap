import {WebAuthError, WebAuthErrorCodes} from 'react-native-auth0';
import {authenticationSettings} from '../settings/authentication';
import {onTapClient, setAccessTokenProvider} from '../api/onTapClient';

type GetCredentials = () => Promise<{accessToken: string} | undefined>;

type Authorize = (
    parameters: {scope: string; audience: string},
    options: {customScheme: string}
) => Promise<unknown>;

type ClearSession = (parameters: Record<string, never>, options: {customScheme: string}) => Promise<unknown>;

export const authenticationService = {
    signInAsync,
    signOutAsync,
    isCancelled,
    configureApiAuthentication,
    getOrCreateCurrentUserAsync,
};

// The SDK provider owns the session; the hook supplies its transport operations.
async function signInAsync(authorize: Authorize): Promise<void> {
    try {
        await authorize(
            {
                scope: 'openid profile email',
                audience: 'https://api.ontap',
            },
            {
                customScheme: authenticationSettings.customScheme,
            },
        );
    } catch (error) {
        if (!isCancelled(error)) {
            console.error('[AuthenticationService] Signing in failed.', error);
        }
        throw error;
    }
}

async function signOutAsync(clearSession: ClearSession): Promise<void> {
    try {
        await clearSession({}, {customScheme: authenticationSettings.customScheme});
    } catch (error) {
        if (!isCancelled(error)) {
            console.error('[AuthenticationService] Signing out failed.', error);
        }
        throw error;
    }
}

function isCancelled(error: unknown): boolean {
    return error instanceof WebAuthError && error.type === WebAuthErrorCodes.USER_CANCELLED;
}

function configureApiAuthentication(
    getCredentials: GetCredentials | null
): void {
    setAccessTokenProvider(
        getCredentials
            ? async () => {
                try {
                    const credentials = await getCredentials();
                    return credentials?.accessToken ?? null;
                } catch (error) {
                    console.error(
                        '[AuthenticationService] Getting access token failed.',
                        error
                    );
                    throw error;
                }
            }
            : null
    );
}

async function getOrCreateCurrentUserAsync(signal?: AbortSignal) {
    try {
        return await onTapClient.usersClient.getOrCreateCurrentUser(signal);
    } catch (error) {
        if (!signal?.aborted) {
            console.error(
                '[AuthenticationService] Getting or creating current user failed.',
                error
            );
        }
        throw error;
    }
}
