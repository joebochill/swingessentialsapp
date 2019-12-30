import * as React from 'react';
// Components
import { View, ScrollView } from 'react-native';
import { Body, SEHeader } from '../../components/index';
// Styles
import { sharedStyles } from '../../styles';

// Utilities
import { splitParagraphs } from '../../utilities';
import { height } from '../../utilities/dimensions';

// Constants
import { HEADER_COLLAPSED_HEIGHT } from '../../constants';

export const SingleBlog = props => {
    const blog = props.navigation.getParam('blog', null);
    if (blog === null) {
        props.navigation.popToTop();
    }
    return (
        blog && (
            <View style={[sharedStyles.pageContainer, { paddingTop: HEADER_COLLAPSED_HEIGHT }]}>
                <SEHeader title={blog.date} subtitle={blog.title} mainAction={'back'} />
                <ScrollView
                    contentContainerStyle={[sharedStyles.paddingMedium, { paddingBottom: height * 0.5 }]}
                    keyboardShouldPersistTaps={'always'}
                >

                    {splitParagraphs(blog.body).map((p, ind) => (
                        <Body key={`${blog.id}_p_${ind}`} style={sharedStyles.paragraph}>
                            {p}
                        </Body>
                    ))}
                </ScrollView>
            </View>
        )
    );
};
