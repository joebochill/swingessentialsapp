import { useAppTheme } from '@/theme';
import { TextInput, TextInputProps } from 'react-native-paper';

export const StyledTextInput: React.FC<TextInputProps> = (props) => {
    const theme = useAppTheme();
    const { style, ...rest } = props;
    return (
        <TextInput
            autoCorrect={false}
            autoCapitalize={'none'}
            returnKeyType={'next'}
            underlineColorAndroid={'transparent'}
            style={[
                theme.dark ? { backgroundColor: `${theme.colors.surface}E0` } : {},
                ...(Array.isArray(style) ? style : [style]),
            ]}
            theme={theme.dark ? { colors: { primary: theme.colors.onPrimary } } : {}}
            {...rest}
        />
    );
};
