import {StyleSheet, View} from 'react-native';
import {AppText} from '../components/typography/AppText';
import {useTheme} from '../hooks';

export default function PubRuns() {
    const {colors} = useTheme();

    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <AppText>Pub runs</AppText>
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
