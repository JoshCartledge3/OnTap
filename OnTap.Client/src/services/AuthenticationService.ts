import {WebAuthError, WebAuthErrorCodes} from 'react-native-auth0';
import {authenticationSettings} from '../settings/authentication';

type Authorize = (parameters: {scope: string}, options: {customScheme: string}) => Promise<unknown>;
type ClearSession = (parameters: Record<string, never>, options: {customScheme: string}) => Promise<unknown>;

export const authenticationService = {
    signInAsync,
    signOutAsync,
    isCancelled,
};

// The SDK provider owns the session; the hook supplies its transport operations.
async function signInAsync(authorize: Authorize): Promise<void> {
    try {
        await authorize({scope: 'openid profile email'}, {customScheme: authenticationSettings.customScheme});
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
