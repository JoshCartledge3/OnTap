import {View, Text} from "react-native";
import {Beer} from "lucide-react-native/icons";
import {useTheme} from "../../hooks";
import {createMapStyles} from "./mapStyles";

type Props = {
    rating: number | null,
    active: boolean,
}

export function PubMarker({rating, active} : Props) {
    const {colors} = useTheme();
    const styles = createMapStyles(colors);
    const textStyle = active ? styles.pubMarkerTextActive : styles.pubMarkerText;

    return(
        <View
            style={[
                styles.pubMarker,
                active && styles.pubMarkerActive,
            ]}
        >
            <Beer size={18} color={textStyle.color} />
            {rating !== null && (
                <Text style={textStyle}>
                    | {rating.toFixed(1)}
                </Text>
            )}
        </View>
    )
}
