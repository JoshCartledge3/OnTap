import { PubsClient } from './generated/client';
import { developmentSettings } from '../settings/development';

export const onTapClient = {
    pubsClient: new PubsClient(
        developmentSettings.apiBaseUrl,
        { fetch }
    ),
};