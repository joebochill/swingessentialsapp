import React, { JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RefreshControl, SectionList } from 'react-native';
import MatIcon from '@react-native-vector-icons/material-icons';
import bg from '../../images/banners/lessons.jpg';
import { ROUTES } from '../../constants/routes';
import { getLongDate, makeGroups } from '../../utilities';
import { StackScreenProps } from '@react-navigation/stack';
import { useAppTheme } from '../../theme';
import { CollapsibleHeader } from '../../components/CollapsibleHeader/CollapsibleHeader';
import { useCollapsibleHeader } from '../../components/CollapsibleHeader/useCollapsibleHeader';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { useNavigation } from '@react-navigation/core';
import { SectionHeader, Stack } from '../../components/layout';
import { ListItem } from '../../components/ListItem';
import { Typography } from '../../components/typography';
import { LessonsTutorial } from '../../components/tutorials';

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

export const Lessons: React.FC = () => {
    const navigation = useNavigation<StackScreenProps<RootStackParamList>>();
    const lessons = {} as any; //useSelector((state: ApplicationState) => state.lessons);
    const role: string = ''; //useSelector((state: ApplicationState) => state.login.role);
    const myLessons = lessons.pending.concat(lessons.closed);
    const sections = makeGroups(myLessons, (lesson: Lesson) => getLongDate(lesson.request_date));
    const theme = useAppTheme();
    const dispatch = useDispatch();
    const { scrollProps, headerProps, contentProps } = useCollapsibleHeader();

    return (
        <>
            <CollapsibleHeader
                title={'Your Lessons'}
                subtitle={"See how far you've come"}
                backgroundImage={bg}
                navigationIcon={{
                    name: 'arrow-back',
                    // onPress: () => navigation.pop(),
                }}
                actionItems={[
                    {
                        name: 'add-circle',
                        // onPress: (): void => navigation.navigate(ROUTES.SUBMIT),
                    },
                ]}
                {...headerProps}
            />
            <SectionList
                {...scrollProps}
                contentContainerStyle={contentProps.contentContainerStyle}
                refreshControl={
                    <RefreshControl
                        refreshing={lessons.loading}
                        // onRefresh={(): void => dispatch(loadLessons())}
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
                        // onPress={(): void => navigation.push(ROUTES.LESSON, { lesson: null })}
                        right={({ style, ...rightProps }): JSX.Element => (
                            <Stack direction={'row'} align={'center'} style={[style]} {...rightProps}>
                                <Typography variant={'labelMedium'} style={{ marginRight: theme.spacing.sm }}>
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
                }
                renderItem={({ item, index }): JSX.Element =>
                    item.response_video ? (
                        <ListItem
                            bottomDivider
                            topDivider={index === 0}
                            title={role === 'administrator' ? item.username : item.request_date}
                            description={
                                role === 'administrator'
                                    ? item.request_date
                                    : item.type === 'in-person'
                                    ? 'In-person lesson'
                                    : 'Remote lesson'
                            }
                            // onPress={(): void => navigation.push(ROUTES.LESSON, { lesson: item })}
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
                                        color={theme.colors.primary}
                                        style={{ marginRight: -1 * theme.spacing.md }}
                                    />
                                </Stack>
                            )}
                        />
                    ) : (
                        <ListItem
                            bottomDivider
                            topDivider={index === 0}
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
                                    <Typography style={{ marginRight: theme.spacing.md }}>IN PROGRESS</Typography>
                                </Stack>
                            )}
                        />
                    )
                }
                keyExtractor={(item): string => `complete_${item.request_id}`}
            />
            <LessonsTutorial />
        </>
    );
};
