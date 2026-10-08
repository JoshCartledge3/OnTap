import { Stack } from 'expo-router';
import Providers from "../providers/Providers";
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <Providers>
                <Stack screenOptions={{ headerShown: false }} />
            </Providers>
        </GestureHandlerRootView>
    )
}