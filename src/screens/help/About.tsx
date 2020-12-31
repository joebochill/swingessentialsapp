import * as React from 'react';

// Components
import { View } from 'react-native';
import { Body, CollapsibleHeaderLayout } from '../../components';

// Styles
import { useSharedStyles, useListStyles, useFlexStyles } from '../../styles';
import { useTheme, Subheading } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useLinkProps } from '@react-navigation/native';

export const About: React.FC<StackScreenProps<RootStackParamList, 'About'>> = (props) => {
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const listStyles = useListStyles(theme);
    const flexStyles = useFlexStyles(theme);
    return (
        <CollapsibleHeaderLayout title={'About'} subtitle={'What is SwingEssentials®?'} navigation={props.navigation}>
            <View style={flexStyles.paddingHorizontal}>
                <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0 }]}>
                    <Subheading style={listStyles.heading}>{'Lessons on Your Schedule'}</Subheading>
                </View>
                <Body>
                    Swing Essentials® provides you with affordable, individualized one-on-one lessons from a
                    PGA-certified golf pro from the comfort and convenience of your home.
                </Body>

                <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.jumbo, marginHorizontal: 0 }]}>
                    <Subheading style={listStyles.heading}>{'How it Works'}</Subheading>
                </View>
                <Body>1) Open the Swing Essentials® app and snap a short video of your swing using your camera.</Body>
                <Body style={sharedStyles.paragraph}>
                    2) Preview your swing and when you’re ready, submit your videos for professional analysis.
                </Body>
                <Body style={sharedStyles.paragraph}>
                    3) Within 48 hours, you will receive a personalized video highlighting what you’re doing well plus
                    areas of your swing that could be improved.
                </Body>

                <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.jumbo, marginHorizontal: 0 }]}>
                    <Subheading style={listStyles.heading}>{'Why Swing Essentials®'}</Subheading>
                </View>
                <Body>
                    Swing Essentials® offers a true one-on-one experience. Our PGA-certified professional puts a
                    personal touch on each and every lesson, giving you the confidence to know that your lesson is just
                    for you. But don’t take our word for it - hear what our customers have to say.
                </Body>

                <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.jumbo, marginHorizontal: 0 }]}>
                    <Subheading style={listStyles.heading}>{'Testimonials'}</Subheading>
                </View>
                <Body>
                    "Thanks for the great work this last year. After working with you, I've lowered my handicap by three
                    and a half!"
                </Body>
                <Body style={sharedStyles.paragraph} font={'semiBold'}>
                    - David A.
                </Body>
                <Body style={{ marginTop: theme.spaces.large }}>
                    "I sent my swing in to Swing Essentials® and I'm playing so much better - it's easily taken four to
                    five shots off my game. I strongly recommend it!"
                </Body>
                <Body style={sharedStyles.paragraph} font={'semiBold'}>
                    - Dean L.
                </Body>
                <Body style={{ marginTop: theme.spaces.large }}>
                    "Thanks to you, I have been playing my best golf. It's all finally clicking now!"
                </Body>
                <Body style={sharedStyles.paragraph} font={'semiBold'}>
                    - Will M.
                </Body>
            </View>
        </CollapsibleHeaderLayout>
    );
};
