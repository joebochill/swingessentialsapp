import React, { ReactNode, useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import Modal from 'react-native-modal';

type BottomSheetProps = {
    show?: boolean;
    children?: ReactNode;
    dismissBottomSheet?: () => void;
};

export const BottomSheet: React.FC<BottomSheetProps> = (props) => {
    const { show, children, dismissBottomSheet } = props;
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(show ? true : false);

    useEffect((): void => {
        setIsBottomSheetVisible(show ? true : false);
    }, [show]);

    return (
        <Modal
            isVisible={isBottomSheetVisible}
            backdropOpacity={0.5}
            onBackdropPress={dismissBottomSheet}
            supportedOrientations={['portrait', 'landscape']}
            style={{ justifyContent: 'flex-end', margin: 0 }}
        >
            <SafeAreaView style={{ backgroundColor: 'white' }}>{children}</SafeAreaView>
        </Modal>
    );
};
