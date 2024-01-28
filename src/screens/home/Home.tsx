import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Components
import { View } from 'react-native';
import { VideoCard, CollapsibleHeaderLayout, HomeTutorial, SEButton, H4, Label } from '../../components';
import Carousel from 'react-native-snap-carousel';

// Constants
import { ROUTES } from '../../constants/routes';

// Styles
import { useSharedStyles, useFlexStyles, useListStyles } from '../../styles';
import { width } from '../../utilities/dimensions';
import { useTheme, Subheading, Text } from 'react-native-paper';
import bg from '../../images/banners/landing.jpg';

// Utilities
import { getLongDate } from '../../utilities';

// Types
import { ApplicationState } from '../../__types__';

// Redux
import { loadUserContent } from '../../redux/actions';
// import { unit } from '../../styles/sizes';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigator';
// import { Spacer } from '@brightlayer-ui/react-native-components';

export const Home: React.FC<StackScreenProps<RootStackParamList, 'Home'>> = (props) => {
    const lessons = useSelector((state: ApplicationState) => state.lessons);
    const tips = useSelector((state: ApplicationState) => state.tips);
    const placeholder = useSelector((state: ApplicationState) => state.config.placeholder);
    const credits = useSelector((state: ApplicationState) => state.credits);
    const role = useSelector((state: ApplicationState) => state.login.role);
    const dispatch = useDispatch();
    const theme = useTheme();
    const sharedStyles = useSharedStyles(theme);
    const flexStyles = useFlexStyles(theme);
    const listStyles = useListStyles(theme);

    const latestLessons = lessons.closed.length > 0 ? lessons.closed : [placeholder];
    return (
        <CollapsibleHeaderLayout
            backgroundImage={bg}
            title={'SWING ESSENTIALS'}
            subtitle={'The pro in your pocket'}
            mainAction={'menu'}
            refreshing={lessons.loading || credits.inProgress || tips.loading}
            onRefresh={(): void => {
                // @ts-ignore
                dispatch(loadUserContent());
            }}
            bottomPad={false}
            navigation={props.navigation}
        >
            {/* <Text variant="displayLarge">Display Large</Text>
            <Text variant="displayMedium">Display Medium</Text>
            <Text variant="displaySmall">Display small</Text>

            <Text variant="headlineLarge">Headline Large</Text>
            <Text variant="headlineMedium">Headline Medium</Text>
            <Text variant="headlineSmall">Headline Small</Text>

            <Text variant="titleLarge">Title Large</Text>
            <Text variant="titleMedium">Title Medium</Text>
            <Text variant="titleSmall">Title Small</Text>

            <Text variant="bodyLarge">Body Large</Text>
            <Text variant="bodyMedium">Body Medium</Text>
            <Text variant="bodySmall">Body Small</Text>

            <Text variant="labelLarge">Label Large</Text>
            <Text variant="labelMedium">Label Medium</Text>
            <Text variant="labelSmall">Label Small</Text> */}
            {role === 'anonymous' && (
                <View
                    style={[
                        flexStyles.centered,
                        flexStyles.paddingMedium,
                        {
                            // marginTop: -1 * theme.spaces.medium,
                            // marginBottom: theme.spaces.medium,
                            backgroundColor: theme.colors.surface,
                            flexDirection: 'row',
                            borderWidth: 1,
                            // borderColor: theme.colors.light,
                        },
                    ]}
                >
                    <SEButton
                        mode={'contained'}
                        title={'Sign Up Today'}
                        style={{ flex: 1 }}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.REGISTER)}
                    />
                    {/* <Spacer flex={0} width={theme.sizes.xSmall} /> */}
                    <SEButton
                        mode={'contained'}
                        title={'Sign In'}
                        style={{ flex: 1 }}
                        // @ts-ignore
                        onPress={(): void => props.navigation.navigate(ROUTES.LOGIN)}
                    />
                </View>
            )}
            <View style={[sharedStyles.sectionHeader]}>
                <Subheading style={listStyles.heading}>{'Latest Lessons'}</Subheading>
                <SEButton
                    mode={'outlined'}
                    title={'View All'}
                    // @ts-ignore
                    onPress={(): void => props.navigation.navigate(ROUTES.LESSONS)}
                />
            </View>
            <Carousel
                data={latestLessons.slice(0, role === 'administrator' ? 5 : 3)}
                renderItem={({ item }): JSX.Element => (
                    <VideoCard
                        // headerIcon={item.type === 'in-person' ? 'settings-remote' : 'settings-remote'}
                        headerTitle={item.request_date}
                        headerSubtitle={role === 'administrator' ? item.username : undefined}
                        video={item.response_video}
                        // @ts-ignore
                        onExpand={(): void => props.navigation.push(ROUTES.LESSON, { lesson: item })}
                    />
                )}
                sliderWidth={width}
                itemWidth={width - 2 * 8/*theme.spaces.medium*/}
                inactiveSlideScale={0.95}
            />

            <View style={[sharedStyles.sectionHeader, /*{ marginTop: theme.spaces.xLarge }*/]}>
                <Subheading style={listStyles.heading}>{'Lesson Credits'}</Subheading>
                <SEButton
                    mode={'outlined'}
                    title={'Order More'}
                    // @ts-ignore
                    onPress={(): void => props.navigation.navigate(ROUTES.ORDER)}
                />
            </View>
            <View style={[flexStyles.row, flexStyles.paddingHorizontal, { justifyContent: 'space-between' }]}>
                <View
                    style={[
                        flexStyles.centered,
                        flexStyles.paddingMedium,
                        {
                            flex: 1,
                            borderWidth: 1,
                            borderRadius: theme.roundness,
                        },
                        { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.outline },
                    ]}
                >
                    <Text variant={'displayMedium'} style={{color: theme.colors.primary}}>
                        {credits.count}
                    </Text>
                    <Text variant={'labelLarge'} style={{color: theme.colors.primary}}>{`Credit${credits.count !== 1 ? 's' : ''} Remaining`}</Text>
                    {credits.count > 0 && (
                        <SEButton
                            mode={'outlined'}
                            title={'Submit a Swing'}
                            icon={'publish'}
                            // style={{ marginTop: theme.spaces.medium }}
                            // @ts-ignore
                            onPress={(): void => props.navigation.navigate(ROUTES.SUBMIT)}
                        />
                    )}
                </View>
            </View>

            {tips.tipList.length > 0 && (
                <>
                    <View style={[sharedStyles.sectionHeader, /*{ marginTop: theme.spaces.xLarge }*/]}>
                        <Subheading style={listStyles.heading}>{'Tip of the Month'}</Subheading>
                        <SEButton
                            mode={'outlined'}
                            title={'View All'}
                            // @ts-ignore
                            onPress={(): void => props.navigation.navigate(ROUTES.TIPS)}
                        />
                    </View>
                    <Carousel
                        data={tips.tipList.slice(0, 3)}
                        renderItem={({ item }): JSX.Element => (
                            <VideoCard
                                // headerIcon={'event'}
                                headerTitle={item.title}
                                // @ts-ignore
                                headerSubtitle={role === 'administrator' ? getLongDate(item.date) : ''}
                                video={item.video}
                                // @ts-ignore
                                onExpand={(): void => props.navigation.push(ROUTES.TIP, { tip: item })}
                            />
                        )}
                        sliderWidth={width}
                        itemWidth={width - 2 * 8/*theme.spaces.medium*/}
                        inactiveSlideScale={0.95}
                    />
                </>
            )}
            <HomeTutorial />
        </CollapsibleHeaderLayout>
    );
};
