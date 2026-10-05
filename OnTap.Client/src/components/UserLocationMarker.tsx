import {Image, StyleSheet, View} from 'react-native';
import {Marker} from '@maplibre/maplibre-react-native';
import type {UserLocation} from '../models';

type UserLocationMarkerProps = {
    location: UserLocation;
    mapBearing: number;
};

export default function UserLocationMarker({location, mapBearing}: UserLocationMarkerProps) {
    return (
        <Marker
            id="user-location"
            lngLat={[location.longitude, location.latitude]}>
            <View
                collapsable={false}
                pointerEvents="none"
                style={styles.locationIndicator}>
                {location.heading !== null && (
                    <Image
                        source={require('../assets/maps/location-heading-cone.png')}
                        style={[
                            styles.headingCone,
                            {transform: [{rotate: `${location.heading - mapBearing}deg`}]},
                        ]}
                    />
                )}
                <View style={styles.locationHalo}/>
                <View style={styles.locationMarker}/>
            </View>
        </Marker>
    );
}

const styles = StyleSheet.create({
    locationIndicator: {
        width: 96,
        height: 96,
    },
    headingCone: {
        ...StyleSheet.absoluteFill,
        width: 96,
        height: 96,
    },
    locationHalo: {
        position: 'absolute',
        top: 33,
        left: 33,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(37, 99, 235, 0.12)',
    },
    locationMarker: {
        position: 'absolute',
        top: 38,
        left: 38,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#2563eb',
        borderWidth: 3,
        borderColor: '#ffffff',
    },
});
