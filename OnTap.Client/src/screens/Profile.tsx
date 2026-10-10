import {Pressable, StyleSheet, View} from 'react-native';
import {AppText} from '../components/typography/AppText';
import {useAuthentication, useTheme} from '../hooks';

export default function Profile() {
    const {colors} = useTheme();
    const {user, isLoading, errorMessage, signInAsync, signOutAsync} = useAuthentication();

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <AppText variant="large" weight="bold">{user?.name ?? 'Your profile'}</AppText>
            {user?.email && <AppText style={{color: colors.textMuted}}>{user.email}</AppText>}
            {!user && <AppText style={styles.description}>Sign in to your OnTap account.</AppText>}
            <Pressable disabled={isLoading} accessibilityRole="button"
                       onPress={() => { void (user ? signOutAsync() : signInAsync()).catch(() => {
                           // The service logs errors and the hook provides the message.
                       }); }}
                       style={[styles.button, {backgroundColor: colors.accent, opacity: isLoading ? 0.5 : 1}]}>
                <AppText weight="bold" style={{color: colors.onAccent}}>
                    {isLoading ? 'Please wait…' : user ? 'Sign out' : 'Sign in'}
                </AppText>
            </Pressable>
            {errorMessage && <AppText accessibilityRole="alert">{errorMessage}</AppText>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        gap: 16,
    },
    description: {textAlign: 'center'},
    button: {minHeight: 48, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24,
        alignItems: 'center', justifyContent: 'center'},
});
