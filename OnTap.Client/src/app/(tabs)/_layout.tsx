import {NativeTabs} from 'expo-router/unstable-native-tabs';
import {useTheme} from '../../hooks';

export default function TabsLayout() {
    const {colors} = useTheme();

    return (
        <NativeTabs
            tintColor={colors.accent}
            iconColor={{default: colors.textMuted, selected: colors.accent}}
            labelStyle={{
                default: {color: colors.textMuted},
                selected: {color: colors.accent},
            }}
        >
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Icon sf={{default: 'map', selected: 'map.fill'}} md="map" />
                <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="pub-runs">
                <NativeTabs.Trigger.Icon sf="point.topleft.down.to.point.bottomright.curvepath" md="route" />
                <NativeTabs.Trigger.Label>Pub runs</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="saved">
                <NativeTabs.Trigger.Icon sf={{default: 'heart', selected: 'heart.fill'}} md="favorite" />
                <NativeTabs.Trigger.Label>Saved</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="activity">
                <NativeTabs.Trigger.Icon sf="waveform.path.ecg" md="monitoring" />
                <NativeTabs.Trigger.Label>Activity</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="profile">
                <NativeTabs.Trigger.Icon sf={{default: 'person.crop.circle', selected: 'person.crop.circle.fill'}} md="account_circle" />
                <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}