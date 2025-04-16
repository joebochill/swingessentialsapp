import React, { JSX, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RefreshControl, SectionList } from 'react-native';
import MatIcon from '@react-native-vector-icons/material-icons';
import bg from '../../images/banners/lessons.jpg';
import { ROUTES } from '../../constants/routes';
import { getLongDate, makeGroups } from '../../utilities';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { CollapsibleHeader } from '../../components/CollapsibleHeader/CollapsibleHeader';
import { useCollapsibleHeader } from '../../components/CollapsibleHeader/useCollapsibleHeader';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { useNavigation } from '@react-navigation/core';
import { SectionHeader, Stack } from '../../components/layout';
import { ListItem } from '../../components/ListItem';
import { Typography } from '../../components/typography';
import { LessonsTutorial } from '../../components/tutorials';
import {
    LessonBasicDetails,
    useGetCompletedLessonsQuery,
    useGetPendingLessonsQuery,
} from '../../redux/apiServices/lessonsService';
import { RootState } from '../../redux/store';
import { format } from 'date-fns';

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

export const Lessons: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const theme = useAppTheme();
    const role = useSelector((state: RootState) => state.auth.role);

    // Lesson Data
    const [page, setPage] = useState(1);
    const [completedLessons, setCompletedLessons] = useState<LessonBasicDetails[]>([]);
    const {
        data: { data: loadedLessons = [], totalPages = 0 } = {},
        isFetching: loadingMore,
        isUninitialized,
    } = useGetCompletedLessonsQuery({ page, users: '' });

    const { data: { data: pendingLessons = [] } = {}, isFetching: loadingPending } = useGetPendingLessonsQuery('');

    const allLessons = [...pendingLessons, ...completedLessons];
    const sections = makeGroups(allLessons, (lesson: Lesson) => getLongDate(lesson.request_date));

    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    useEffect(() => {
        if (loadedLessons.length > 0) {
            setCompletedLessons((prevLessons) => {
                const newLessons = [...prevLessons, ...loadedLessons];
                const uniqueLessons = newLessons.filter(
                    (lesson, index, self) => index === self.findIndex((l) => l.request_url === lesson.request_url)
                );
                return uniqueLessons;
            });
        }
    }, [loadedLessons]);

    // Reset state when the user logs out
    useEffect(() => {
        if (role === 'anonymous') {
            setCompletedLessons([]);
            setPage(1);
        }
    }, [role]);

    const handleLoadMore = () => {
        if (!loadingMore && page + 1 < totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <>
            <CollapsibleHeader
                title={'Your Lessons'}
                subtitle={"See how far you've come"}
                backgroundImage={bg}
                navigationIcon={{
                    name: 'arrow-back',
                    onPress: () => navigation.pop(),
                }}
                actionItems={[
                    {
                        name: 'add-circle',
                        onPress: (): void => navigation.navigate(ROUTES.SUBMIT),
                    },
                ]}
                {...headerProps}
            />
            <SectionList<LessonBasicDetails>
                {...scrollProps}
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={loadingMore || loadingPending}
                        onRefresh={handleLoadMore}
                        progressViewOffset={contentProps.contentContainerStyle.paddingTop}
                    />
                }
                renderSectionHeader={({ section: { bucketName } }): JSX.Element => (
                    <SectionHeader
                        title={bucketName}
                        style={{ marginTop: theme.spacing.xxl, marginHorizontal: theme.spacing.md }}
                    />
                )}
                sections={sections}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <ListItem
                        topDivider
                        bottomDivider
                        title={'Welcome to Swing Essentials!'}
                        style={{ marginTop: theme.spacing.xxl }}
                        onPress={(): void => navigation.push(ROUTES.LESSON, { lesson: null })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                <Typography variant={'labelMedium'} style={{ marginRight: theme.spacing.sm }}>
                                    NEW
                                </Typography>
                                <MatIcon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.onPrimaryContainer}
                                    style={{ marginRight: -1 * theme.spacing.md }}
                                />
                            </Stack>
                        )}
                    />
                }
                renderItem={({ item, index, section }): JSX.Element => {
                    // Calculate the overall index
                    const sectionIndex = sections.findIndex((s) => s === section);
                    const overallIndex =
                        sections
                            .slice(0, sectionIndex)
                            .reduce((total, currentSection) => total + currentSection.data.length, 0) + index;

                    return overallIndex >= pendingLessons.length ? (
                        <ListItem
                            bottomDivider
                            topDivider={index === 0}
                            title={
                                role === 'administrator'
                                    ? item.username
                                    : format(new Date(item.request_date), 'yyyy-MM-dd')
                            }
                            description={
                                role === 'administrator'
                                    ? format(new Date(item.request_date), 'yyyy-MM-dd')
                                    : item.type === 'in-person'
                                    ? 'In-person lesson'
                                    : 'Remote lesson'
                            }
                            onPress={(): void => navigation.push(ROUTES.LESSON, { lesson: item.request_url })}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                    {!item.viewed && (
                                        <Typography variant={'labelMedium'} style={{ marginRight: theme.spacing.sm }}>
                                            NEW
                                        </Typography>
                                    )}
                                    <MatIcon
                                        name={'chevron-right'}
                                        size={theme.size.md}
                                        color={theme.colors.onPrimaryContainer}
                                        style={{ marginRight: -1 * theme.spacing.md }}
                                    />
                                </Stack>
                            )}
                        />
                    ) : (
                        <ListItem
                            bottomDivider
                            topDivider={index === 0}
                            title={
                                role === 'administrator'
                                    ? item.username
                                    : format(new Date(item.request_date), 'yyyy-MM-dd')
                            }
                            description={
                                role === 'administrator'
                                    ? format(new Date(item.request_date), 'yyyy-MM-dd')
                                    : item.type === 'in-person'
                                    ? 'In-person lesson'
                                    : 'Remote lesson'
                            }
                            right={({ style, ...rightProps }): JSX.Element => (
                                <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                    <Typography style={{ marginRight: theme.spacing.md }}>IN PROGRESS</Typography>
                                </Stack>
                            )}
                        />
                    );
                }}
                keyExtractor={(item): string => `complete_${item.request_url}`}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
            />
            <LessonsTutorial />
        </>
    );
};
