import * as React from 'react';
// Components
import { View, ScrollView } from 'react-native';
import { Body, SEHeader } from '../../components/index';
// Styles
import { useSharedStyles, useFlexStyles, useListStyles } from '../../styles';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';
import { height } from '../../utilities/dimensions';

// Constants
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { useTheme, Subheading } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';

export const SingleBlog: React.FC<StackScreenProps<RootStackParamList, 'SingleBlog'>> = (props) => {
    const { blog } = props.route.params;
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const listStyles = useListStyles(theme);

    if (blog === null) {
        props.navigation.pop();
    }
    return (
        blog && (
            <View style={[sharedStyles.pageContainer, { paddingTop: HEADER_COLLAPSED_HEIGHT }]}>
                <SEHeader title={getLongDate(blog.date)} mainAction={'back'} navigation={props.navigation} />
                <ScrollView
                    contentContainerStyle={[flexStyles.paddingMedium, { paddingBottom: height * 0.5 }]}
                    keyboardShouldPersistTaps={'always'}
                >
                    <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0 }]}>
                        <Subheading style={listStyles.heading}>{blog.title}</Subheading>
                    </View>
                    {splitParagraphs(blog.body).map((p, ind) => (
                        <Body key={`${blog.id}_p_${ind}`} style={[ind > 0 ? sharedStyles.paragraph : {}]}>
                            {p}
                        </Body>
                    ))}
                </ScrollView>
            </View>
        )
    );
};
