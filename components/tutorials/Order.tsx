import { TUTORIAL_KEYS } from '@/_config';
import { Icon } from '@/components/common/Icon';
import { ListItem } from '@/components/common/ListItem';
import { Stack } from '@/components/layout/Stack';
import { TutorialCarousel, TutorialModal } from '@/components/tutorials/Tutorial';
import { newTutorialAvailable, setTutorialWatched } from '@/components/tutorials/tutorialsUtilities';
import { Typography } from '@/components/typography/Typography';
import { useGetPackagesQuery } from '@/redux/apiServices/packagesService';
import { useAppTheme } from '@/theme';
import React, { JSX, useEffect, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';

export const OrderTutorial: React.FC = () => {
    const { data: packages = [] } = useGetPackagesQuery();
    const [showTutorial, setShowTutorial] = useState(false);
    const [carouselHeight, setCarouselHeight] = useState<number>(0);
    const theme = useAppTheme();

    const slides = [
        <Stack
            key={1}
            onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                setCarouselHeight((prev) => (height > prev ? height : prev));
            }}
        >
            <Typography variant={'displaySmall'} fontWeight={'semiBold'} color={'onPrimary'} align={'center'}>
                {'Lesson Packages'}
            </Typography>
            <Typography
                variant={'bodyMedium'}
                fontWeight={'light'}
                color={'onPrimary'}
                align={'center'}
                style={{ marginTop: theme.spacing.sm }}
            >
                {
                    'We offer multiple lesson packages at different price points. Ensure that you have a payment method linked to your phone before purchasing.'
                }
            </Typography>
            <Stack style={{ marginTop: theme.spacing.lg }}>
                {packages.map((item, index) => (
                    <ListItem
                        key={index}
                        bottomDivider
                        topDivider={index === 0}
                        title={item.name}
                        description={item.description}
                        titleNumberOfLines={2}
                        titleEllipsizeMode={'tail'}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack
                                direction={'row'}
                                align={'center'}
                                style={[style, { marginRight: -1 * theme.spacing.sm }]}
                                {...rightProps}
                            >
                                <Typography variant={'labelMedium'}>
                                    {packages.length > 0 ? `$${item.price}` : '--'}
                                </Typography>
                                {index === 0 && (
                                    <Icon
                                        name={'check'}
                                        size={theme.size.md}
                                        color={theme.colors.onPrimaryContainer}
                                        style={{ marginLeft: theme.spacing.sm }}
                                    />
                                )}
                            </Stack>
                        )}
                    />
                ))}
            </Stack>
        </Stack>,
    ];

    useEffect(() => {
        const checkTutorialAvailability = async () => {
            const isAvailable = await newTutorialAvailable(TUTORIAL_KEYS.ORDER);
            setShowTutorial(isAvailable);
        };
        checkTutorialAvailability();
    }, []);

    return (
        <TutorialModal
            visible={showTutorial}
            onClose={(): void => {
                setTutorialWatched(TUTORIAL_KEYS.ORDER);
                setShowTutorial(false);
            }}
        >
            <TutorialCarousel
                slides={slides}
                height={carouselHeight || 200} // Fallback to a default height if not calculated yet
                onClose={(): void => {
                    setTutorialWatched(TUTORIAL_KEYS.ORDER);
                    setShowTutorial(false);
                }}
            />
        </TutorialModal>
    );
};
