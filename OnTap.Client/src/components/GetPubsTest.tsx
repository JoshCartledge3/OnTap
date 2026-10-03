import {StyleSheet, Text, View, Button, Alert} from 'react-native';
import {usePubs} from "../hooks";

export default function GetPubsTest() {

    const {pubs, getPubsAsync} = usePubs();

    async function onGetPubs() {
        try {
            await getPubsAsync();
        }
        catch {
            Alert.alert("Error", "Could not load pubs.");
        }
    }

    return(
        <View style={styles.container}>
            <Button title="Get Pubs" onPress={()=>getPubsAsync()} />
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
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 8
    },
});
