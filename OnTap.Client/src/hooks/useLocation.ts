import {locationService} from "../services/LocationService";

export function useLocation() {
    async function getCurrentUserLocationAsync() {
        return locationService.getCurrentUserLocationAsync();
    }

    return { getCurrentUserLocationAsync };
}