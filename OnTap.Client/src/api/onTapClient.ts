import {PubsClient, UsersClient} from './generated/client';
import {developmentSettings} from '../settings/development';

type AccessTokenProvider = () => Promise<string | null>;

let accessTokenProvider: AccessTokenProvider | null = null;

export function setAccessTokenProvider(provider: AccessTokenProvider | null) {
    accessTokenProvider = provider;
}

async function authenticatedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const headers = new Headers(init?.headers);
    const token = await accessTokenProvider?.();

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return globalThis.fetch(input, {...init, headers});
}

const transport = {fetch: authenticatedFetch};

export const onTapClient = {
    pubsClient: new PubsClient(
        developmentSettings.apiBaseUrl,
        transport
    ),
    usersClient: new UsersClient(
        developmentSettings.apiBaseUrl,
        transport
    ),
};