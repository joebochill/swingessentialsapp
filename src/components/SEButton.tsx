import React from 'react';
// Components
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const useStyles = () =>
    StyleSheet.create({
        textButton: {
            marginHorizontal: 0,
        },
    });

type SEButtonProps = React.ComponentProps<typeof Button> & {
    title: string;
};
export const SEButton: React.FC<SEButtonProps> = props => {
    const { title, mode = 'contained', style, contentStyle, labelStyle, ...other } = props;
    const styles = useStyles();
    return (
        // @ts-ignore
        <Button
            uppercase={mode !== 'text'}
            mode={mode}
            style={[style]}
            contentStyle={[contentStyle]}
            labelStyle={[mode === 'text' ? styles.textButton : {}, labelStyle]}
            {...other}>
            {title}
        </Button>
    );
};
