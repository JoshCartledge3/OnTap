import {StyleSheet, View} from 'react-native';
import {AppText} from '../components/typography/AppText';
import {useTheme} from '../hooks';

export default function Activity() {
    const {colors} = useTheme();

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <AppText>Activity</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
