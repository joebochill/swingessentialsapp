import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import { SEHeader } from '../../../components';
import { ScrollView } from 'react-native-gesture-handler';
import { sharedStyles } from '../../../styles';
import { Body, H6, H7 } from '@pxblue/react-native-components';

export const About = (props) => (
    <View style={sharedStyles.pageContainer}>
        <SEHeader title={'About'} subtitle={'...who we are'} />
        <ScrollView contentContainerStyle={sharedStyles.paddingMedium}>
            <H6>What is Swing Essentials™?</H6>

            <H7 style={sharedStyles.textTitle}>Lessons On Your Schedule</H7>
            <Body style={sharedStyles.paragraph}>Swing Essentials™ provides you with affordable, individualized one-on-one lessons from a PGA-certified golf pro from the comfort and convenience of your home.</Body>
            
            <H7 style={sharedStyles.textTitle}>How It Works</H7>
            <Body style={sharedStyles.paragraph}>1) Open the Swing Essentials™ app and snap a short video of your swing using your camera.</Body>
            <Body style={sharedStyles.paragraph}>2) Preview your swing and when you’re ready, submit your videos for professional analysis.</Body>
            <Body style={sharedStyles.paragraph}>3) Within 48 hours, you will receive a personalized video highlighting what you’re doing well plus areas of your swing that could be improved.</Body>
            
            <H7 style={sharedStyles.textTitle}>Why Swing Essentials™</H7>
            <Body style={sharedStyles.paragraph}>Swing Essentials™ offers a true one-on-one experience. Our PGA-certified professional puts a personal touch on each and every lesson, giving you the confidence to know that your lesson is just for you. But don’t take our word for it - hear what our customers have to say.</Body>
            
            <H7 style={sharedStyles.textTitle}>Testimonials</H7>
            <Body style={sharedStyles.paragraph}>"Thanks for the great work this last year. After working with you, I've lowered my handicap by three and a half!"</Body>
            <Body style={sharedStyles.paragraph} font={'semiBold'}>- David A.</Body>
            <Body style={sharedStyles.paragraph}>"I sent my swing in to Swing Essentials™ and I'm playing so much better - it's easily taken four to five shots off my game. I strongly recommend it!"</Body>
            <Body style={sharedStyles.paragraph} font={'semiBold'}>- Dean L.</Body>
            <Body style={sharedStyles.paragraph}>"Thanks to you, I have been playing my best golf. It's all finally clicking now!"</Body>
            <Body style={sharedStyles.paragraph} font={'semiBold'}>- Will M.</Body>
            
            <SafeAreaView />
        </ScrollView>
    </View>
);
