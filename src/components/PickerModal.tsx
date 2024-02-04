import React, { Fragment } from 'react';
import { SafeAreaView } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';
import { useAppTheme } from '../theme';
import { ListItem } from '.';
import { Divider } from 'react-native-paper';

type PickerMenuOption = {
    label: string;
    onPress?: (() => void) | (() => Promise<void>);
};
type PickerMenuProps = Partial<Omit<ModalProps, 'children'>> & {
    menuOptions: PickerMenuOption[];
};

export const PickerModal: React.FC<PickerMenuProps> = (props) => {
    const { menuOptions, style, ...otherModalProps } = props;
    const theme = useAppTheme();

    return (
        <Modal
            backdropOpacity={0.5}
            supportedOrientations={['portrait', 'landscape']}
            statusBarTranslucent
            style={[
                { justifyContent: 'flex-end', margin: 0, height: '100%', flex: 1 },
                ...(Array.isArray(style) ? style : [style]),
            ]}
            {...otherModalProps}
        >
            <SafeAreaView style={[{ backgroundColor: theme.colors.surface }]}>
                {menuOptions.map((option, index) => (
                    <Fragment key={index}>
                        {index > 0 && <Divider />}
                        <ListItem
                            key={index}
                            title={option.label}
                            titleNumberOfLines={1}
                            titleEllipsizeMode={'tail'}
                            onPress={option.onPress}
                        />
                    </Fragment>
                ))}
            </SafeAreaView>
        </Modal>
    );
};
