import { Platform } from 'react-native';

const deviceApiUrl = process.env.EXPO_PUBLIC_API_URL;

if (Platform.OS !== 'web' && !deviceApiUrl) {
    throw new Error('Start with npm start or set EXPO_PUBLIC_API_URL for local device development.');
}

export const developmentSettings = {
    apiBaseUrl: Platform.OS === 'web'
        ? 'https://localhost:7243'
        : deviceApiUrl!,
};
