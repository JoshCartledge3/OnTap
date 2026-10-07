import {useTheme} from "../../hooks";
import {Pressable} from "react-native";
import {GlassSurface} from "../layout/GlassSurface";
import {LayersIcon} from "lucide-react-native";
import {mapStyles} from "./mapStyles";

export function MapLayers() {

    const {colors} = useTheme();

    return (
        <Pressable
            accessibilityRole={"button"}
            accessibilityLabel={"Show map layers"}>
            <GlassSurface style={mapStyles.mapIconButtonRound} interactive>
                <LayersIcon color={colors.text} size={20} />
            </GlassSurface>
        </Pressable>
    )
}