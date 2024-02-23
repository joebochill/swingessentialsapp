import React from 'react';
import { SafeAreaView } from 'react-native';
import Modal, { ModalProps } from 'react-native-modal';
import { useAppTheme } from '../theme';
import { ListItem } from '.';

type PickerMenuOption = {
    label: string;
    onPress?: (() => void) | (() => Promise<void>);
};
type PickerMenuProps = Partial<Omit<ModalProps, 'children'>> & {
    menuOptions: PickerMenuOption[];
};

export const PickerModal: React.FC<PickerMenuProps> = (props) => {
    const { menuOptions, style, backdropOpacity = 0.5, ...otherModalProps } = props;
    const theme = useAppTheme();

    return (
        <Modal
            backdropOpacity={backdropOpacity}
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
                    <ListItem
                        key={index}
                        topDivider={index > 0}
                        title={option.label}
                        titleNumberOfLines={1}
                        titleEllipsizeMode={'tail'}
                        onPress={option.onPress}
                    />
                ))}
            </SafeAreaView>
        </Modal>
    );
};
