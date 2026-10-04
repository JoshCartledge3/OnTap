import {StyleSheet, Text, View, Button, Alert} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {usePubs} from "../hooks";
import {useState} from "react";
import {useLocation} from "../hooks/useLocation";

export default function GetPubsTest() {

    const {pubs, pubsInRange, getPubsAsync, getPubsInRangeAsync} = usePubs();
    const {getCurrentUserLocationAsync} = useLocation();
    const [radiusKilometres, setRadiusKilometres] = useState(0.5);

    async function onGetPubs() {
        try {
            await getPubsAsync();
        }
        catch {
            Alert.alert("Error", "Could not load pubs.");
        }
    }

    async function onGetPubsInRange() {
        try {
            const currentLocation = await getCurrentUserLocationAsync();
            await getPubsInRangeAsync(currentLocation, radiusKilometres);
        }
        catch {
            Alert.alert("Error", "Could not load pubs.");
        }
    }

    return(
        <>
            <View style={styles.container}>
                <Button title="Get Pubs" onPress={()=>onGetPubs()} />
                {pubs.map(pub => (
                    <Text key={pub.id}>
                        {pub.name}
                        {' \n'}
                        {pub.address}, {pub.postcode}
                        {' \n'}
                        {pub.latitude}, {pub.longitude}
                        {' \n'}
                        Created at: {pub.createdAt}
                        {' \n'}
                        {pub.status}
                    </Text>
                ))}
            </View>
            <View style={styles.container}>
                <Picker selectedValue={radiusKilometres} onValueChange={value => setRadiusKilometres(value)}>
                    <Picker.Item label="0.5 km" value={0.5} />
                    <Picker.Item label="1 km" value={1} />
                    <Picker.Item label="2 km" value={2} />
                    <Picker.Item label="5 km" value={5} />
                </Picker>
                <Button title="Get Nearby Pubs" onPress={()=>onGetPubsInRange()} />
                {pubsInRange.map(pub => (
                    <Text key={pub.id}>
                        {pub.name}
                        {' \n'}
                        {pub.address}, {pub.postcode}
                        {' \n'}
                        {pub.latitude}, {pub.longitude}
                        {' \n'}
                        Created at: {pub.createdAt}
                        {' \n'}
                        {pub.status}
                    </Text>
                ))}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 8
    },
});
