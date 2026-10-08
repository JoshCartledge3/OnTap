import type {PubDto} from '../../api/generated/client';
import {useTheme} from '../../hooks';
import {View, StyleSheet} from "react-native";
import {AppText} from "../typography/AppText";
import Heart from "lucide-react-native/icons/heart";
import {getPubInitials} from "../../utils/getPubInitials";

type Props = {
    pub: PubDto;
};

export default function PubListItem({pub}: Props) {
    const {colors} = useTheme();

    return (
        <View style={styles.row}>
            <View style={[
                styles.thumbnail,
                {backgroundColor: colors.surfaceMuted},
            ]}>
                <AppText weight="bold">
                    {getPubInitials(pub.name)}
                </AppText>
            </View>

            <View style={styles.details}>
                <View style={styles.heading}>
                    <AppText
                        weight="bold"
                        numberOfLines={1}
                        style={styles.name}
                    >
                        {pub.name}
                    </AppText>

                    <Heart size={20} color={colors.textMuted}/>
                </View>

                <AppText
                    variant="small"
                    numberOfLines={1}
                    style={{color: colors.textMuted}}
                >
                    {pub.address}
                </AppText>

                <AppText variant="small">
                    Guinness + 11 on draught
                </AppText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    details: {
        flex: 1,
        paddingTop: 2,
        gap: 6,
    },
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    name: {
        flex: 1,
        fontSize: 18,
        lineHeight: 22,
    },
});
