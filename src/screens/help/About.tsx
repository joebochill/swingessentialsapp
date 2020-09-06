import * as React from 'react';

// Components
import { View } from 'react-native';
import { Body, CollapsibleHeaderLayout, SEButton } from '../../components';

// Styles
import { useSharedStyles } from '../../styles';
import { useTheme } from 'react-native-paper';

export const About = () => {
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    return (
        <CollapsibleHeaderLayout title={'About'} subtitle={'What is SwingEssentials®?'}>
            <View style={sharedStyles.paddingHorizontalMedium}>
                <View style={[sharedStyles.sectionHeader, { marginHorizontal: 0 }]}>
                    <SEButton mode={'text'} title={'Lessons on Your Schedule'} uppercase />
                </View>
                <Body>
                    Swing Essentials® provides you with affordable, individualized one-on-one lessons from a
                    PGA-certified golf pro from the comfort and convenience of your home.
                </Body>

                <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.jumbo, marginHorizontal: 0 }]}>
                    <SEButton mode={'text'} title={'How It Works'} uppercase />
                </View>
                <Body>
                    1) Open the Swing Essentials® app and snap a short video of your swing using your camera.
                </Body>
                <Body style={sharedStyles.paragraph}>
                    2) Preview your swing and when you’re ready, submit your videos for professional analysis.
                </Body>
                <Body style={sharedStyles.paragraph}>
                    3) Within 48 hours, you will receive a personalized video highlighting what you’re doing well plus
                    areas of your swing that could be improved.
                </Body>

                <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.jumbo, marginHorizontal: 0 }]}>
                    <SEButton mode={'text'} title={'Why Swing Essentials®'} uppercase />
                </View>
                <Body>
                    Swing Essentials® offers a true one-on-one experience. Our PGA-certified professional puts a
                    personal touch on each and every lesson, giving you the confidence to know that your lesson is just
                    for you. But don’t take our word for it - hear what our customers have to say.
                </Body>

                <View style={[sharedStyles.sectionHeader, { marginTop: theme.spaces.jumbo, marginHorizontal: 0 }]}>
                    <SEButton mode={'text'} title={'Testimonials'} uppercase />
                </View>
                <Body>
                    "Thanks for the great work this last year. After working with you, I've lowered my handicap by three
                    and a half!"
                </Body>
                <Body style={sharedStyles.paragraph} font={'semiBold'}>
                    - David A.
                </Body>
                <Body style={{marginTop: theme.spaces.large}}>
                    "I sent my swing in to Swing Essentials® and I'm playing so much better - it's easily taken four to
                    five shots off my game. I strongly recommend it!"
                </Body>
                <Body style={sharedStyles.paragraph} font={'semiBold'}>
                    - Dean L.
                </Body>
                <Body style={{marginTop: theme.spaces.large}}>
                    "Thanks to you, I have been playing my best golf. It's all finally clicking now!"
                </Body>
                <Body style={sharedStyles.paragraph} font={'semiBold'}>
                    - Will M.
                </Body>
            </View>
        </CollapsibleHeaderLayout>
    );
};
