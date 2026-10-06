import {useTheme} from "../../hooks";
import {createMapStyles} from "./mapStyles";
import {View, Text} from "react-native";


type Props = {
    count: number
}

export function PubCluster({count}: Props) {
    const {colors} = useTheme();
    const styles = createMapStyles(colors);

    return(
        <View style={styles.pubMarker}>
            <Text style={styles.pubMarkerText}>
                {count}
            </Text>
        </View>
    )
}