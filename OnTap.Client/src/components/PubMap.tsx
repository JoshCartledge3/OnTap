import { StyleSheet, View } from 'react-native';
import { Map } from '@maplibre/maplibre-react-native';
import type { StyleSpecification } from '@maplibre/maplibre-react-native';
import mapStyle from '../assets/maps/ontap-map-style-light.json';

export default function PubMap() {
    return (
        <View style={styles.container}>
            <Map
                style={StyleSheet.absoluteFill}
                mapStyle={mapStyle as StyleSpecification}
                logo={false}
                attribution={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
    },
});
