import type {ComponentType} from 'react';
import type {TextInputProps} from 'react-native';
import {View, StyleSheet, TextInput, Pressable} from "react-native";
import {useTheme} from "../../hooks";
import {Search, X} from "lucide-react-native/icons";

type Props = {
    value: string;
    onChangeText: (value: string) => void;
    onSubmitSearch?: (value: string) => void;
    placeholder?: string;
    inputComponent?: ComponentType<TextInputProps>;
};

export default function SearchBar({
    value,
    onChangeText,
    onSubmitSearch,
    placeholder = 'Search',
    inputComponent: Input = TextInput,
}: Props) {
    const {colors} = useTheme();

    return (
        <View style={[styles.field, {backgroundColor: `${colors.text}14`}]}>
            <Search size={20} color={colors.textMuted}/>

            <Input
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={event => onSubmitSearch?.(event.nativeEvent.text)}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
                accessibilityLabel={placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                submitBehavior="blurAndSubmit"
                style={[styles.input, {color: colors.text}]}
            />

            {value.length > 0 && (
                <Pressable
                    onPress={() => onChangeText('')}
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                    hitSlop={8}
                    style={styles.clearButton}
                >
                    <X size={20} color={colors.text}/>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 48,
        paddingHorizontal: 14,
        gap: 12,
        borderRadius: 999,
    },
    input: {
        flex: 1,
        minWidth: 0,
        paddingVertical: 12,
        fontSize: 16,
    },
    clearButton: {
        width: 32,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
