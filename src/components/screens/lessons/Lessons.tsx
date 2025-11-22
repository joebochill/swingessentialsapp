import React, { JSX, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RefreshControl, SectionList } from 'react-native';
import bg from '../../../assets/images/banners/lessons.jpg';
import { ROUTES } from '../../../navigation/routeConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppTheme } from '../../../theme';
import { RootStackParamList } from '../../../navigation/MainNavigation';
import { useNavigation } from '@react-navigation/core';
import { SectionHeader } from '../../typography/SectionHeader';
import { Stack } from '../../layout/Stack';
import { ListItem } from '../../common/ListItem';
import { Typography } from '../../typography';
import { LessonsTutorial } from '../../tutorials';
import {
    LessonBasicDetails,
    useGetCompletedLessonsQuery,
    useGetPendingLessonsQuery,
} from '../../../redux/apiServices/lessonsService';
import { RootState } from '../../../redux/store';
import { format } from 'date-fns';
import { Icon } from '../../common/Icon';
import { CollapsibleHeader, useCollapsibleHeader } from '../../layout/CollapsibleHeader';

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
        refetch: refetchCompleted,
    } = useGetCompletedLessonsQuery({ page, users: '' });

    const {
        data: { data: pendingLessons = [] } = {},
        isFetching: loadingPending,
        refetch: refetchPending,
    } = useGetPendingLessonsQuery('');

    const allLessons = useMemo(() => {
        return [...pendingLessons, ...completedLessons];
    }, [pendingLessons, completedLessons]);

    // group the lessons by month-year
    const lessonsByGroup = useMemo(() => {
        return allLessons.reduce((acc, lesson) => {
            const bucket = format(new Date(lesson.request_date), 'MMMM yyyy') || 'Unknown';
            if (!acc[bucket]) {
                acc[bucket] = [];
            }
            acc[bucket].push(lesson);
            return acc;
        }, {} as Record<string, LessonBasicDetails[]>);
    }, [allLessons]);

    const sections = Object.entries(lessonsByGroup).map(([bucketName, lessonsData]) => ({
        bucketName,
        data: lessonsData,
    }));

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
                subtitle={`See how far you've come`}
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
                        onRefresh={async () => {
                            setPage(1);
                            refetchPending();
                            const result = await refetchCompleted().unwrap();
                            if (result.data) {
                                setCompletedLessons(result.data);
                            }
                        }}
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
                                <Icon
                                    name={'chevron-right'}
                                    size={theme.size.md}
                                    color={theme.colors.onPrimaryContainer}
                                    style={{ marginRight: -1 * theme.spacing.sm }}
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
                                    <Icon
                                        name={'chevron-right'}
                                        size={theme.size.md}
                                        color={theme.colors.onPrimaryContainer}
                                        style={{ marginRight: -1 * theme.spacing.sm }}
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
