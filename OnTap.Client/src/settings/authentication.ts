const domain = process.env.EXPO_PUBLIC_AUTH0_DOMAIN;
const clientId = process.env.EXPO_PUBLIC_AUTH0_CLIENT_ID;

if (!domain || !clientId) {
    throw new Error('Set EXPO_PUBLIC_AUTH0_DOMAIN and EXPO_PUBLIC_AUTH0_CLIENT_ID in OnTap.Client/.env.');
}

export const authenticationSettings = {
    domain,
    clientId,
    customScheme: 'ontap',
};
