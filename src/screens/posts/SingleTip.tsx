import * as React from 'react';
// Components
import { View, ScrollView } from 'react-native';
import { Body, SEHeader, YouTube } from '../../components/index';
// Styles
import { useSharedStyles, useListStyles, useFlexStyles } from '../../styles';
import { width, height, aspectHeight } from '../../utilities/dimensions';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';
// Constants
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { useTheme, Subheading } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';

export const SingleTip: React.FC<StackScreenProps<RootStackParamList, 'SingleTip'>> = (props) => {
    const { tip } = props.route.params;
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const listStyles = useListStyles(theme);
    const flexStyles = useFlexStyles(theme);

    if (tip === null) {
        props.navigation.pop();
    }
    const videoWidth = width - 2 * 8/*theme.spaces.medium*/;
    const videoHeight = aspectHeight(videoWidth);

    return (
        tip && (
            <View style={[sharedStyles.pageContainer, { paddingTop: HEADER_COLLAPSED_HEIGHT }]}>
                {/* @ts-ignore */}
                <SEHeader title={getLongDate(tip.date)} mainAction={'back'} navigation={props.navigation} />
                <ScrollView
                    contentContainerStyle={[flexStyles.paddingMedium, { paddingBottom: height * 0.5 }]}
                    keyboardShouldPersistTaps={'always'}
                >
                    <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0 }]}>
                        <Subheading style={listStyles.heading}>{tip.title}</Subheading>
                    </View>
                    <YouTube videoId={tip.video} style={{ width: videoWidth, height: videoHeight }} />
                    <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0, /*marginTop: theme.spaces.jumbo*/ }]}>
                        <Subheading style={listStyles.heading}>{'Description'}</Subheading>
                    </View>
                    {splitParagraphs(tip.comments).map((p, ind) => (
                        <Body key={`${tip.id}_p_${ind}`} style={[ind > 0 ? sharedStyles.paragraph : {}]}>
                            {p}
                        </Body>
                    ))}
                </ScrollView>
            </View>
        )
    );
};
