import { BASE_URL } from '@/_config';
import bg from '@/assets/images/banners/pros.jpg';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { useCollapsibleHeader } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { Paragraph } from '@/components/typography/Paragraph';
import { Typography } from '@/components/typography/Typography';
import { ProBio, useGetProsQuery } from '@/redux/apiServices/prosService';
import { useAppTheme } from '@/theme';
import { width } from '@/utilities/dimensions';
import { splitParagraphs } from '@/utilities/text';
import * as React from 'react';
import { Image, ScrollView, View } from 'react-native';

export default function ProsScreen() {
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();
    const theme = useAppTheme();
    const { data: pros = [] } = useGetProsQuery();

    return (
        <>
            <Header
                title={'Meet Our Pros'}
                subtitle={'The folks behind the magic'}
                backgroundImage={bg}
                {...headerProps}
            />
            <ScrollView
                {...scrollProps}
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={contentProps.contentContainerStyle}
            >
                <Stack
                    gap={theme.spacing.xxl}
                    style={{
                        paddingHorizontal: theme.spacing.md,
                        marginTop: theme.spacing.xl,
                    }}
                >
                    {pros.map((pro: ProBio) => (
                        <View key={`pro_${pro.id}`}>
                            <View
                                style={[
                                    {
                                        width: width / 2,
                                        height: width / 2,
                                        maxWidth: 200,
                                        maxHeight: 200,
                                        alignSelf: 'center',
                                        borderRadius: width / 4,
                                        overflow: 'hidden',
                                        backgroundColor: theme.dark
                                            ? theme.colors.surface
                                            : theme.colors.primaryContainer,
                                    },
                                ]}
                            >
                                <Image
                                    source={{
                                        uri: pro.image.startsWith('http')
                                            ? pro.image
                                            : `${BASE_URL}/images/pros/${pro.image}`,
                                    }}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </View>
                            <Typography
                                variant={'bodyLarge'}
                                fontWeight={'semiBold'}
                                color={'onPrimaryContainer'}
                                style={{
                                    textAlign: 'center',
                                    marginTop: theme.spacing.sm,
                                }}
                            >
                                {pro.name}
                            </Typography>
                            {pro.title ? (
                                <Typography
                                    variant={'bodyLarge'}
                                    fontWeight={'light'}
                                    color={'onPrimaryContainer'}
                                    style={{
                                        textAlign: 'center',
                                        lineHeight: 16,
                                    }}
                                >
                                    {pro.title}
                                </Typography>
                            ) : null}
                            <Stack gap={theme.spacing.md} style={{ marginTop: theme.spacing.md }}>
                                {splitParagraphs(pro.bio).map((p, ind) => (
                                    <Paragraph key={`${pro.id}_p_${ind}`}>{p}</Paragraph>
                                ))}
                            </Stack>
                        </View>
                    ))}
                </Stack>
            </ScrollView>
        </>
    );
}
