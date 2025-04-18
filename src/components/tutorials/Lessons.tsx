import React, { JSX, useEffect, useState } from 'react';
import { SectionList, LayoutChangeEvent } from 'react-native';
import { TutorialCarousel, TutorialModal } from './';
import { TUTORIAL_KEYS } from '../../constants';
import { getLongDate, getDate } from '../../utilities';
import { useAppTheme } from '../../theme';
import { SectionHeader, Stack } from '../layout';
import { Typography } from '../typography';
import { ListItem } from '../ListItem';
import { Icon } from '../Icon';
import { newTutorialAvailable, setTutorialWatched } from '../../utilities/tutorials';

export const LessonsTutorial: React.FC = () => {
    const [showTutorial, setShowTutorial] = useState(false);
    const [carouselHeight, setCarouselHeight] = useState<number>(0);
    const theme = useAppTheme();

    const sections = [
        {
            bucketName: getLongDate(Date.now()),
            data: [
                {
                    date: getDate(Date.now()),
                    new: true,
                },
                {
                    date: getDate(Date.now() - 24 * 60 * 60 * 1000),
                    new: false,
                },
            ],
        },
    ];

    const slides = [
        <Stack
            key={1}
            onLayout={(event: LayoutChangeEvent) => {
                const { height } = event.nativeEvent.layout;
                if (height > carouselHeight) {
                    setCarouselHeight(height); // Update height dynamically
                }
            }}
        >
            <Typography variant={'displaySmall'} fontWeight={'semiBold'} color={'onPrimary'} align={'center'}>
                {'Your Lessons'}
            </Typography>
            <Typography
                variant={'bodyMedium'}
                fontWeight={'light'}
                color={'onPrimary'}
                align={'center'}
                style={{ marginTop: theme.spacing.sm }}
            >
                {'When you have submitted your golf swing for analysis, your lessons will appear in this list.'}
            </Typography>
            <SectionList
                style={{ marginTop: theme.spacing.lg }}
                scrollEnabled={false}
                renderSectionHeader={({ section: { bucketName } }): JSX.Element => (
                    <SectionHeader
                        title={bucketName}
                        titleStyle={{ color: theme.colors.onPrimary }}
                        style={{ marginHorizontal: theme.spacing.md }}
                    />
                )}
                sections={sections}
                renderItem={({ item, index }): JSX.Element => (
                    <ListItem
                        bottomDivider
                        topDivider={index === 0}
                        title={item.date}
                        description={'Remote Lesson'}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                {item.new && (
                                    <Typography
                                        style={{
                                            marginRight: theme.spacing.sm,
                                        }}
                                    >
                                        NEW
                                    </Typography>
                                )}
                                <Icon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.onPrimaryContainer}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                )}
                keyExtractor={(item): string => `complete_${item.date}`}
            />
        </Stack>,
    ];

    useEffect(() => {
        const checkTutorialAvailability = async () => {
            const isAvailable = await newTutorialAvailable(TUTORIAL_KEYS.LESSON_LIST);
            setShowTutorial(isAvailable);
        };
        checkTutorialAvailability();
    }, []);

    return (
        <TutorialModal
            visible={showTutorial}
            onClose={(): void => {
                setTutorialWatched(TUTORIAL_KEYS.LESSON_LIST);
                setShowTutorial(false);
            }}
        >
            <TutorialCarousel
                slides={slides}
                height={carouselHeight || 200} // Fallback to a default height if not calculated yet
                onClose={(): void => {
                    setTutorialWatched(TUTORIAL_KEYS.LESSON_LIST);
                    setShowTutorial(false);
                }}
            />
        </TutorialModal>
    );
};
