import bg from '@/assets/images/banners/lessons.jpg';
import { Icon } from '@/components/common/Icon';
import { ListItem } from '@/components/common/ListItem';
import { Header } from '@/components/layout/CollapsibleHeader/Header';
import { useCollapsibleHeader } from '@/components/layout/CollapsibleHeader/useCollapsibleHeader';
import { Stack } from '@/components/layout/Stack';
import { LessonsTutorial } from '@/components/tutorials/Lessons';
import { SectionHeader } from '@/components/typography/SectionHeader';
import { Typography } from '@/components/typography/Typography';
import {
    LessonBasicDetails,
    useGetCompletedLessonsQuery,
    useGetPendingLessonsQuery,
} from '@/redux/apiServices/lessonsService';
import { RootState } from '@/redux/store';
import { useAppTheme } from '@/theme';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React, { JSX, useEffect, useMemo, useState } from 'react';
import { RefreshControl, SectionList } from 'react-native';
import { useSelector } from 'react-redux';

export default function LessonsPage() {
    const router = useRouter();
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
        return allLessons.reduce(
            (acc, lesson) => {
                const bucket = format(new Date(lesson.request_date), 'MMMM yyyy') || 'Unknown';
                if (!acc[bucket]) {
                    acc[bucket] = [];
                }
                acc[bucket].push(lesson);
                return acc;
            },
            {} as Record<string, LessonBasicDetails[]>
        );
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
            <Header
                title={'Your Lessons'}
                subtitle={`See how far you've come`}
                backgroundImage={bg}
                mainAction="back"
                showAuth={false}
                actionItems={[
                    {
                        name: 'add-circle',
                        onPress: () => router.push('/(drawer)/(screens)/(submit)'),
                    },
                ]}
                {...headerProps}
            />
            <SectionList<LessonBasicDetails>
                {...scrollProps}
                style={{ backgroundColor: theme.colors.background }}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    role !== 'anonymous' ? (
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
                            tintColor={theme.dark ? theme.colors.onBackground : theme.colors.primary}
                            progressViewOffset={contentProps.contentContainerStyle.paddingTop}
                        />
                    ) : undefined
                }
                renderSectionHeader={({ section: { bucketName } }): JSX.Element => (
                    <SectionHeader
                        title={bucketName}
                        style={{
                            marginTop: theme.spacing.xxl,
                            marginHorizontal: theme.spacing.md,
                        }}
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
                        onPress={(): void =>
                            router.push({
                                pathname: '/(drawer)/(screens)/lessons/placeholder',
                            })
                        }
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
                            onPress={(): void =>
                                router.push({
                                    pathname: '/(drawer)/(screens)/lessons/[id]',
                                    params: { id: item.request_url },
                                })
                            }
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
}
