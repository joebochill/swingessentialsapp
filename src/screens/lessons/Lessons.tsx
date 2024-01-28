import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View, SectionList } from 'react-native';
import { Body, CollapsibleHeaderLayout, LessonsTutorial, wrapIcon } from '../../components';
import MatIcon from 'react-native-vector-icons/MaterialIcons';

// Styles
import { useSharedStyles, useFlexStyles, useListStyles } from '../../styles';
import { useTheme, List, Divider, Subheading } from 'react-native-paper';
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
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const listStyles = useListStyles(theme);
    const dispatch = useDispatch();

    return (
        <CollapsibleHeaderLayout
            title={'Your Lessons'}
            subtitle={"See how far you've come"}
            backgroundImage={bg}
            refreshing={lessons.loading}
            // @ts-ignore
            onRefresh={(): void => dispatch(loadLessons())}
            actionItems={[
                {
                    icon: AddIcon,
                    // @ts-ignore
                    onPress: (): void => props.navigation.navigate(ROUTES.SUBMIT),
                },
            ]}
            navigation={props.navigation}
        >
            <SectionList
                renderSectionHeader={({ section: { bucketName, index } }): JSX.Element => (
                    <View style={[sharedStyles.sectionHeader, /*index > 0 ? { marginTop: theme.spaces.jumbo } :*/ {}]}>
                        <Subheading style={listStyles.heading}>{bucketName}</Subheading>
                    </View>
                )}
                sections={sections}
                stickySectionHeadersEnabled={false}
                ListEmptyComponent={
                    <>
                        <Divider />
                        <List.Item
                            title={'Welcome to Swing Essentials!'}
                            // @ts-ignore
                            onPress={(): void => props.navigation.push(ROUTES.LESSON, { lesson: null })}
                            style={listStyles.item}
                            titleStyle={{ marginLeft: -8 }}
                            descriptionStyle={{ marginLeft: -8 }}
                            right={({ style, ...rightProps }): JSX.Element => (
                                <View style={[flexStyles.row, style]} {...rightProps}>
                                    <Body /*style={{ marginRight: theme.spaces.small }}*/>NEW</Body>
                                    <MatIcon
                                        name={'chevron-right'}
                                    // size={theme.sizes.small}
                                    // style={{ marginRight: -1 * theme.spaces.small }}
                                    />
                                </View>
                            )}
                        />
                        <Divider />
                    </>
                }
                renderItem={({ item, index }): JSX.Element =>
                    item.response_video ? (
                        <>
                            {index === 0 && <Divider />}
                            <List.Item
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
                                style={listStyles.item}
                                titleStyle={{ marginLeft: -8 }}
                                descriptionStyle={{ marginLeft: -8 }}
                                right={({ style, ...rightProps }): JSX.Element => (
                                    <View style={[flexStyles.row, style]} {...rightProps}>
                                        {!item.viewed && <Body /*style={{ marginRight: theme.spaces.small }}*/>NEW</Body>}
                                        <MatIcon
                                            name={'chevron-right'}
                                        // size={theme.sizes.small}
                                        // style={{ marginRight: -1 * theme.spaces.small }}
                                        />
                                    </View>
                                )}
                            />
                            <Divider />
                        </>
                    ) : (
                        <>
                            {index === 0 && <Divider />}
                            <List.Item
                                title={role === 'administrator' ? item.username : item.request_date}
                                description={
                                    role === 'administrator'
                                        ? item.request_date
                                        : item.type === 'in-person'
                                            ? 'In-person lesson'
                                            : 'Remote lesson'
                                }
                                style={listStyles.item}
                                titleStyle={{ marginLeft: -8 }}
                                descriptionStyle={{ marginLeft: -8 }}
                                right={({ style, ...rightProps }): JSX.Element => (
                                    <View style={[flexStyles.row, style]} {...rightProps}>
                                        <Body /*style={{ marginRight: theme.spaces.small }}*/>IN PROGRESS</Body>
                                    </View>
                                )}
                            />
                            <Divider />
                        </>
                    )
                }
                keyExtractor={(item): string => `complete_${item.request_id}`}
            />
            <LessonsTutorial />
        </CollapsibleHeaderLayout>
    );
};
