import * as Location from 'expo-location';

export const locationService = {
    async getCurrentUserLocationAsync() {
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!permission.granted) {
            throw new Error('Location permission was denied.');
        }

        const { coords } = await Location.getCurrentPositionAsync({});

        return {
            latitude: coords.latitude,
            longitude: coords.longitude,
        };
    },
};