import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { Animated, SectionList } from 'react-native';
import { Typography, LessonsTutorial, wrapIcon, SectionHeader, Stack, ListItem } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Styles
import { Divider } from 'react-native-paper';
import bg from '../../images/banners/lessons.jpg';

// Constants
import { ROUTES } from '../../constants/routes';

// Utilities
import { getLongDate, makeGroups } from '../../utilities';

// Types
import { ApplicationState } from '../../__types__';
// Actions
import { loadLessons } from '../../redux/actions';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
import { useAppTheme } from '../../theme';
import { CollapsibleHeaderLayout } from '../../components/CollapsableHeaderLayout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AddIcon = wrapIcon({ IconClass: MatIcon, name: 'add-circle' });

/* eslint-disable @typescript-eslint/naming-convention */
type Lesson = {
    request_id: number;
    dtl_swing: string;
    fo_swing: string;
    request_date: string;
    request_notes: string;
    request_url: string;
    response_notes: string;
    response_status: 'good' | 'rejected' | 'other';
    username: string;
    viewed: boolean;
};
/* eslint-enable @typescript-eslint/naming-convention */

export const Lessons: React.FC<StackScreenProps<RootStackParamList, 'Lessons'>> = (props) => {
    const lessons = useSelector((state: ApplicationState) => state.lessons);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const myLessons = lessons.pending.concat(lessons.closed);
    // @ts-ignore
    const sections = makeGroups(myLessons, (lesson: Lesson) => getLongDate(lesson.request_date));
    const theme = useAppTheme();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    return (
        <>
            <CollapsibleHeaderLayout
                HeaderProps={{
                    expandedHeight: 200,
                    collapsedHeight: 56,
                    expandable: true,
                    startExpanded: true,
                    variant: 'dynamic',
                    title: 'Valley Forge One',
                    subtitle: 'Hello',
                    // style: { opacity: 0.5, flex: 1 },
                }}
                ScrollComponent={(
                    handleScroll: (e: any) => void,
                    contentPadding: Animated.Value,
                    contentOffset: { x: number; y: number }
                ): any => (
                    <SectionList
                        scrollEventThrottle={32}
                        contentContainerStyle={{
                            // You must convert the contentPadding Animated.value to a number before using it in the context of contentContainerStyles since the container is not Animated
                            // If this is omitted you will be unable to scroll to the bottom of the FlatList
                            paddingTop: parseInt(JSON.stringify(contentPadding)),

                            // Additional padding added to the bottom of the contentContainer
                            paddingBottom: 24,
                        }}
                        contentOffset={contentOffset}
                        // Be sure to call the handleScroll method here to update the view on scroll
                        onScroll={(e: any): any => handleScroll(e)}
                        renderSectionHeader={({ section: { bucketName } }): JSX.Element => (
                            <SectionHeader
                                title={bucketName}
                                style={{ marginTop: theme.spacing.xxl, marginHorizontal: theme.spacing.md }}
                            />
                        )}
                        sections={sections}
                        stickySectionHeadersEnabled={false}
                        ListEmptyComponent={
                            <Stack style={{ marginTop: theme.spacing.xxl }}>
                                <Divider />
                                <ListItem
                                    title={'Welcome to Swing Essentials!'}
                                    // @ts-ignore
                                    onPress={(): void => props.navigation.push(ROUTES.LESSON, { lesson: null })}
                                    right={({ style, ...rightProps }): JSX.Element => (
                                        <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                            <Typography
                                                variant={'labelMedium'}
                                                style={{ marginRight: theme.spacing.sm }}
                                            >
                                                NEW
                                            </Typography>
                                            <MatIcon
                                                name={'chevron-right'}
                                                size={theme.size.md}
                                                color={theme.colors.primary}
                                                style={{ marginRight: -1 * theme.spacing.md }}
                                            />
                                        </Stack>
                                    )}
                                />
                                <Divider />
                            </Stack>
                        }
                        renderItem={({ item, index }): JSX.Element =>
                            item.response_video ? (
                                <>
                                    {index === 0 && <Divider />}
                                    <ListItem
                                        title={role === 'administrator' ? item.username : item.request_date}
                                        description={
                                            role === 'administrator'
                                                ? item.request_date
                                                : item.type === 'in-person'
                                                ? 'In-person lesson'
                                                : 'Remote lesson'
                                        }
                                        // @ts-ignore
                                        onPress={(): void => props.navigation.push(ROUTES.LESSON, { lesson: item })}
                                        right={({ style, ...rightProps }): JSX.Element => (
                                            <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                                {!item.viewed && (
                                                    <Typography
                                                        variant={'labelMedium'}
                                                        style={{ marginRight: theme.spacing.sm }}
                                                    >
                                                        NEW
                                                    </Typography>
                                                )}
                                                <MatIcon
                                                    name={'chevron-right'}
                                                    size={theme.size.md}
                                                    color={theme.colors.primary}
                                                    style={{ marginRight: -1 * theme.spacing.md }}
                                                />
                                            </Stack>
                                        )}
                                    />
                                    <Divider />
                                </>
                            ) : (
                                <>
                                    {index === 0 && <Divider />}
                                    <ListItem
                                        title={role === 'administrator' ? item.username : item.request_date}
                                        description={
                                            role === 'administrator'
                                                ? item.request_date
                                                : item.type === 'in-person'
                                                ? 'In-person lesson'
                                                : 'Remote lesson'
                                        }
                                        right={({ style, ...rightProps }): JSX.Element => (
                                            <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                                <Typography style={{ marginRight: theme.spacing.md }}>
                                                    IN PROGRESS
                                                </Typography>
                                            </Stack>
                                        )}
                                    />
                                    <Divider />
                                </>
                            )
                        }
                        keyExtractor={(item): string => `complete_${item.request_id}`}
                    />
                )}
            />
            <LessonsTutorial />
        </>
    );
};
