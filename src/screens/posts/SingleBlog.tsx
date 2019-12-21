import * as React from 'react';
import { View } from 'react-native';
import { Body } from '@pxblue/react-native-components';
import { CollapsibleHeaderLayout } from '../../components/index';

import { sharedStyles } from '../../styles';

import { splitParagraphs } from '../../utilities';

export const SingleBlog = props => {
    const blog = props.navigation.getParam('blog', null);
    if (blog === null) {
        props.navigation.popToTop();
    }

    return (
        blog && (
            <CollapsibleHeaderLayout mainAction={'back'} title={blog.date} subtitle={blog.title}>
                <View style={sharedStyles.paddingHorizontalMedium}>
                    {splitParagraphs(blog.body).map((p, ind) => (
                        <Body key={`${blog.id}_p_${ind}`} style={sharedStyles.paragraph}>
                            {p}
                        </Body>
                    ))}
                </View>
            </CollapsibleHeaderLayout>
        )
    );
};
