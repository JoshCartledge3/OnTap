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
                    <br/>
                    <span>
                        {pub.address}, {pub.postcode}
                    </span>
                    <br/>
                    <span>
                        {pub.latitude}, {pub.longitude}
                    </span>
                    <br/>
                    <span>
                        Created at: {pub.createdAt}
                    </span>
                    <br/>
                    {pub.status}
                    <br/>
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
