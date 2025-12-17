import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { useCollapsibleHeader } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { Paragraph } from '@/components/typography/Paragraph';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { Typography } from '@/components/typography/Typography';
import { useGetTestimonialsQuery } from '@/redux/apiServices/testimonialsService';
import { useAppTheme } from '@/theme';
import { capitalize } from '@/utilities/text';
import * as React from 'react';
import { ScrollView } from 'react-native';

export default function AboutScreen() {
    const theme = useAppTheme();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const { data: testimonials } = useGetTestimonialsQuery();

    return (
        <>
            <Header
                title={'About'}
                subtitle={'What is Swing Essentials®?'}
                backgroundColor={theme.dark ? theme.colors.surface : undefined}
                {...headerProps}
            />
            <ScrollView
                {...scrollProps}
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={contentProps.contentContainerStyle}
            >
                <Stack
                    style={{
                        paddingHorizontal: theme.spacing.md,
                        marginTop: theme.spacing.md,
                    }}
                >
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
                                                {`- ${[capitalize(testimonial.first), capitalize(testimonial.last)].join(' ')}${
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
}
