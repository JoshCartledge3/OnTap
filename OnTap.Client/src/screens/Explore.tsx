import { StyleSheet, View } from 'react-native';
import PubMap from '../components/map/PubMap';

export default function Explore() {
    return (
        <View style={styles.container}>
            <PubMap />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});