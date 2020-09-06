import * as React from 'react';
// Components
import { View, ScrollView } from 'react-native';
import { Body, SEHeader } from '../../components/index';
// Styles
import { useSharedStyles, useFlexStyles } from '../../styles';

// Utilities
import { splitParagraphs, getLongDate } from '../../utilities';
import { height } from '../../utilities/dimensions';

// Constants
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';
import { useTheme } from 'react-native-paper';

export const SingleBlog = props => {
    const blog = props.navigation.getParam('blog', null);
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const flexStyles = useFlexStyles(theme);

    if (blog === null) {
        props.navigation.pop();
    }
    return (
        blog && (
            <View style={[sharedStyles.pageContainer, { paddingTop: HEADER_COLLAPSED_HEIGHT }]}>
                <SEHeader title={blog.title} subtitle={getLongDate(blog.date)} mainAction={'back'} />
                <ScrollView
                    contentContainerStyle={[flexStyles.paddingMedium, { paddingBottom: height * 0.5 }]}
                    keyboardShouldPersistTaps={'always'}>
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
