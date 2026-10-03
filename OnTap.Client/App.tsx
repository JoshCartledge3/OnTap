import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Providers from './src/components/Providers';
import GetPubsTest from "./src/components/GetPubsTest";

export default function App() {
  return (
    <Providers>
      <View style={styles.container}>
        <GetPubsTest/>
        <StatusBar style="auto" />
      </View>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
