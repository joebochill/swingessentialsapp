import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../../theme';
import { Header, useCollapsibleHeader } from '../../layout/CollapsibleHeader';
import { ScrollView } from 'react-native';
import { RootStackParamList } from '../../../navigation/MainNavigation';
import { useNavigation } from '@react-navigation/core';
import { SectionHeader } from '../../typography/SectionHeader';
import { Stack } from '../../layout/Stack';
import { Paragraph, Typography } from '../../typography';
import { useGetTestimonialsQuery } from '../../../redux/apiServices/testimonialsService';

export const About: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const { data: testimonials } = useGetTestimonialsQuery();

    return (
        <>
            <Header
                title={'About'}
                subtitle={'What is SwingEssentials®?'}
                navigation={navigation}
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                {...headerProps}
            />
            <ScrollView
                {...scrollProps}
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={contentProps.contentContainerStyle}
            >
                <Stack style={{ paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.md }}>
                    <SectionHeader title={'Lessons on Your Schedule'} />
                    <Paragraph>
                        {`Swing Essentials® provides you with affordable, individualized one-on-one lessons from a PGA-certified golf pro from the comfort and convenience of your home.`}
                    </Paragraph>

                    <SectionHeader title={`How it works`} style={{ marginTop: theme.spacing.xxl }} />
                    <Stack gap={theme.spacing.md}>
                        <Paragraph>
                            {`1) Open the Swing Essentials® app and snap a short video of your swing using your camera.`}
                        </Paragraph>
                        <Paragraph>
                            {`2) Preview your swing and when you're ready, submit your videos for professional analysis.`}
                        </Paragraph>
                        <Paragraph>
                            {`3) Within 48 hours, you will receive a personalized video highlighting what you're doing well plus areas of your swing that could be improved.`}
                        </Paragraph>
                    </Stack>

                    <SectionHeader title={`Why Swing Essentials®`} style={{ marginTop: theme.spacing.xxl }} />
                    <Paragraph>
                        {`Swing Essentials® offers a true one-on-one experience. Our PGA-certified professional puts a personal touch on each and every lesson, giving you the confidence to know that your lesson is just for you. But don 't take our word for it - hear what our customers have to say.`}
                    </Paragraph>

                    {testimonials && (
                        <>
                            <SectionHeader title={`Testimonials`} style={{ marginTop: theme.spacing.xxl }} />
                            <Stack gap={theme.spacing.md}>
                                {testimonials.map((testimonial, index) => {
                                    const joinedNumber = testimonial.joined ? parseInt(testimonial.joined, 10) : 0;
                                    const joinedString =
                                        joinedNumber > 0 ? new Date(joinedNumber * 1000).getFullYear().toString() : '';
                                    return (
                                        <Stack key={`testimonial_${index}`} gap={theme.spacing.xs}>
                                            <Paragraph>{`"${testimonial.review}"`}</Paragraph>

                                            <Typography variant={'bodyLarge'} fontWeight={'semiBold'}>
                                                {`- ${[testimonial.first, testimonial.last].join(' ')}${
                                                    joinedString ? ` (member since ${joinedString})` : ''
                                                }`}
                                            </Typography>
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </>
                    )}
                </Stack>
            </ScrollView>
        </>
    );
};
