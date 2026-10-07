import {LocateFixed} from "lucide-react-native";
import {Pressable} from "react-native";
import {useTheme} from "../../hooks";
import {GlassSurface} from "../layout/GlassSurface";
import {mapStyles} from "./mapStyles";

type Props = {
    onRecenter : () => void;
}

export function Recenter({onRecenter}: Props) {

    const {colors} = useTheme();

    return (
        <Pressable
            onPress={onRecenter}
            accessibilityRole={"button"}
            accessibilityLabel={"Recenter map"}>
            <GlassSurface style={mapStyles.mapIconButtonRound} interactive>
                <LocateFixed color={colors.text} size={24} />
            </GlassSurface>
        </Pressable>
    )
}