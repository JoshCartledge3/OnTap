import {locationService} from "../services/LocationService";

export function useLocation() {
    async function getCurrentUserLocationAsync() {
        const result = locationService.getCurrentUserLocationAsync();
        return result;
    }

    return { getCurrentUserLocationAsync };
}