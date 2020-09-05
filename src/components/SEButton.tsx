import React from 'react';
// Components
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

const useStyles = () =>
    StyleSheet.create({
        textButton: {
            paddingLeft: 0,
            paddingRight: 0,
        },
    });

type SEButtonProps = React.ComponentProps<typeof Button> & {
    title: string;
};
export const SEButton: React.FC<SEButtonProps> = props => {
    const { title, mode = 'contained', style, contentStyle, labelStyle, ...other } = props;
    const styles = useStyles();
    return (
        <Button
            uppercase={mode !== 'text'}
            mode={mode}
            style={[mode === 'text' ? styles.textButton : {}, style]}
            contentStyle={[contentStyle]}
            labelStyle={[labelStyle]}
            {...other}>
            {title}
        </Button>
    );
};
