import * as React from 'react';

// Components
import { Typography, CollapsibleHeaderLayout, Stack, SectionHeader, Spacer } from '../../components';

// TODO: hook up to testimonials API

// Styles
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../styles/theme';

export const About: React.FC<StackScreenProps<RootStackParamList, 'About'>> = (props) => {
    const theme = useAppTheme();

    return (
        <CollapsibleHeaderLayout title={'About'} subtitle={'What is SwingEssentials®?'} navigation={props.navigation}>
            <Stack style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.md }}>
                <SectionHeader title={'Lessons on Your Schedule'} />
                <Typography
                    variant={'bodyLarge'}
                    fontWeight={'light'}
                >{`Swing Essentials® provides you with affordable, individualized one-on-one lessons from a PGA-certified golf pro from the comfort and convenience of your home.`}</Typography>

                <SectionHeader title={'How it works'} style={{ marginTop: theme.spacing.xxl }} />
                <Stack space={theme.spacing.md}>
                    <Typography
                        variant={'bodyLarge'}
                        fontWeight={'light'}
                    >{`1) Open the Swing Essentials® app and snap a short video of your swing using your camera.`}</Typography>
                    <Typography
                        variant={'bodyLarge'}
                        fontWeight={'light'}
                    >{`2) Preview your swing and when you're ready, submit your videos for professional analysis.`}</Typography>
                    <Typography
                        variant={'bodyLarge'}
                        fontWeight={'light'}
                    >{`3) Within 48 hours, you will receive a personalized video highlighting what you're doing well plus areas of your swing that could be improved.`}</Typography>
                </Stack>

                <SectionHeader title={'Why Swing Essentials®'} style={{ marginTop: theme.spacing.xxl }} />
                <Typography
                    variant={'bodyLarge'}
                    fontWeight={'light'}
                >{`Swing Essentials® offers a true one-on-one experience. Our PGA-certified professional puts a personal touch on each and every lesson, giving you the confidence to know that your lesson is just for you. But don 't take our word for it - hear what our customers have to say.`}</Typography>

                <SectionHeader title={'Testimonials'} style={{ marginTop: theme.spacing.xxl }} />
                <Stack space={theme.spacing.md}>
                    <Typography
                        variant={'bodyLarge'}
                        fontWeight={'light'}
                    >{`"Thanks for the great work this last year. After working with you, I've lowered my handicap by three and a half!"`}</Typography>
                    <Typography variant={'bodyLarge'} fontWeight={'semiBold'}>{`- David A.`}</Typography>
                    <Spacer size={theme.spacing.lg} />
                    <Typography
                        variant={'bodyLarge'}
                        fontWeight={'light'}
                    >{`"I sent my swing in to Swing Essentials® and I'm playing so much better - it's easily taken four to five shots off my game. I strongly recommend it!"`}</Typography>
                    <Typography variant={'bodyLarge'} fontWeight={'semiBold'}>{`- Dean L.`}</Typography>
                    <Spacer size={theme.spacing.lg} />
                    <Typography
                        variant={'bodyLarge'}
                        fontWeight={'light'}
                    >{`"Thanks to you, I have been playing my best golf. It's all finally clicking now!"`}</Typography>
                    <Typography variant={'bodyLarge'} fontWeight={'semiBold'}>{`- Will M.`}</Typography>
                </Stack>
            </Stack>
        </CollapsibleHeaderLayout>
    );
};
