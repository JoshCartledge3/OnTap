import {onTapClient} from "../api/onTapClient";

export const pubsService = {
    getPubsAsync() {
        return onTapClient.pubsClient.getPubs();
    }
};