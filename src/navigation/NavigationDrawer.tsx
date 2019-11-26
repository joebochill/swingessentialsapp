import React from 'react';
import {
    Animated,
    SafeAreaView,
    StatusBar,
    Text,
    View,
    Platform,
    FlatList,
    StyleSheet,
    ScrollView,
    Button,
    Alert,
} from 'react-native';
import { APP_VERSION } from '../constants/index';
import { withNavigation } from 'react-navigation';

import { NavigationItems } from './NavigationContent';
// import { ROUTES } from '../constants/routes';

import topology from '../images/topology.png';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Body } from '@pxblue/react-native-components';
import { ListItem, Icon } from 'react-native-elements';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);
const HEADER_EXPANDED_HEIGHT = 200 + getStatusBarHeight();
const HEADER_COLLAPSED_HEIGHT = 56 + getStatusBarHeight();
const DRAWER_WIDTH = 350;

import { DrawerContentComponentProps } from 'react-navigation-drawer';
import { ROUTES } from '../constants/routes';

type NavigatorState = {
    scrollY: Animated.Value;
    currentRoutes: Array<Route>;
    activePanel: 0 | 1 | 2;
    mainLeft: Animated.Value;
    accountLeft: Animated.Value;
    helpLeft: Animated.Value;
};

export class NavigationDrawer extends React.Component<DrawerContentComponentProps, NavigatorState> {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            currentRoutes: NavigationItems[0].data,
            activePanel: 0,
            mainLeft: new Animated.Value(0),
            accountLeft: new Animated.Value(DRAWER_WIDTH),
            helpLeft: new Animated.Value(DRAWER_WIDTH),
        };
    }
    componentDidUpdate() {
        const { activePanel, mainLeft, accountLeft, helpLeft } = this.state

        const mainToValue = activePanel === 0 ? 0 : -1 * DRAWER_WIDTH;
        Animated.timing(mainLeft, {
            toValue: mainToValue,
            duration: 250,
        }).start()
        const accountToValue = activePanel === 1 ? 0 : 1 * DRAWER_WIDTH;
        Animated.timing(accountLeft, {
            toValue: accountToValue,
            duration: 250,
        }).start()
        const helpToValue = activePanel === 2 ? 0 : 1 * DRAWER_WIDTH;
        Animated.timing(helpLeft, {
            toValue: helpToValue,
            duration: 250,
        }).start()
    }
    render() {
        const headerHeight = this.scaleByHeaderHeight(HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT);
        const { mainLeft, accountLeft, helpLeft } = this.state;
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} />
                <AnimatedSafeAreaView
                    style={[
                        styles.bar,
                        {
                            justifyContent: 'flex-end',
                            height: headerHeight,
                            paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
                        },
                    ]}>
                    <Animated.Image
                        source={topology}
                        resizeMethod={'resize'}
                        onPress={() => this.props.navigation.navigate(ROUTES.HOME)}
                        style={[
                            styles.image,
                            {
                                height: headerHeight,
                                opacity: 0.5,
                            },
                        ]}
                    />
                    <Animated.View style={[this.contentStyle()]}>
                        <View style={{ justifyContent: 'center' }}>
                            <Animated.View
                                style={{
                                    height: this.scaleByHeaderHeight(100, 0),
                                    width: this.scaleByHeaderHeight(100, 0),
                                    borderRadius: 100,
                                    backgroundColor: 'white',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                <Animated.Text
                                    adjustsFontSizeToFit
                                    allowFontScaling
                                    style={{
                                        fontSize: this.scaleByHeaderHeight(32, 0),
                                        color: '#4f4c81',
                                    }}>
                                    JB
                                </Animated.Text>
                            </Animated.View>
                        </View>
                        <Animated.View
                            style={{ flex: 1, justifyContent: 'center', marginLeft: this.scaleByHeaderHeight(16, 0) }}>
                            <Animated.Text style={this.titleStyle()} numberOfLines={1} ellipsizeMode={'tail'}>
                                {'joebochill'}
                            </Animated.Text>
                            <Animated.Text style={this.subtitleStyle()} numberOfLines={1} ellipsizeMode={'tail'}>
                                {'Joseph Boyle'}
                            </Animated.Text>
                            <Animated.Text style={this.infoStyle()} numberOfLines={1} ellipsizeMode={'tail'}>
                                {'Member Since April 5, 1989'}
                            </Animated.Text>
                        </Animated.View>
                        <View style={{ marginLeft: 16 }}>
                            <Icon name={'person'} size={24} color={'white'} />
                        </View>
                    </Animated.View>
                    <View

                        style={{
                            flex: 0,
                            height: 56,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 16,
                        }}>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>SWING ESSENTIALS</Text>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '300' }}>{`v${APP_VERSION}`}</Text>
                    </View>
                </AnimatedSafeAreaView>
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    onScroll={Animated.event([
                        {
                            nativeEvent: {
                                contentOffset: {
                                    y: this.state.scrollY,
                                },
                            },
                        },
                    ])}
                    scrollEventThrottle={16}>
                    <View style={{ flexDirection: 'row', backgroundColor: 'orange', position: 'relative' }}>
                        {NavigationItems.map((panel, ind) => {
                            const leftPosition = (ind === 2 ? helpLeft : (ind === 1 ? accountLeft : mainLeft));
                            return (
                                <Animated.View
                                    key={`Panel_${panel.name}`}
                                    style={{
                                        position: 'absolute',
                                        width: DRAWER_WIDTH,
                                        left: leftPosition,
                                    }}
                                >
                                    <FlatList
                                        data={panel.data}
                                        keyExtractor={(item, index) => `${index}`}
                                        renderItem={({ item }) => (
                                            <ListItem
                                                containerStyle={{ paddingHorizontal: 16 }}
                                                bottomDivider
                                                chevron={item.nested}
                                                onPress={item.route ?
                                                    () => {
                                                        this.props.navigation.navigate(item.route);
                                                        // this.setState({ activePanel: 0 });
                                                    } :
                                                    (item.activatePanel !== undefined) ? () => {
                                                        this.setState({ activePanel: item.activatePanel });
                                                    } :
                                                    undefined
                                                }
                                                title={
                                                    <Body font={'regular'} style={{ marginLeft: 16, color: '#231f61' }}>
                                                        {item.title}
                                                    </Body>
                                                }
                                                leftIcon={{
                                                    type: item.iconType || 'material',
                                                    name: item.icon,
                                                    color: '#231f61',
                                                    iconStyle: { marginLeft: 0 },
                                                }}
                                            />
                                        )}
                                    />
                                </Animated.View>
                            )
                        })}
                    </View>
                </ScrollView>
                <SafeAreaView />
            </View>
        );
    }
    scaleByHeaderHeight(atLarge: number, atSmall: number) {
        return this.state.scrollY.interpolate({
            inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
            outputRange: [atLarge, atSmall],
            extrapolate: 'clamp',
        });
    }
    titleStyle() {
        return {
            color: 'white',
            lineHeight: this.scaleByHeaderHeight(24, 0.1),
            fontSize: this.scaleByHeaderHeight(24, 0.1),
            fontWeight: '600',
        };
    }
    subtitleStyle() {
        return {
            color: 'white',
            lineHeight: this.scaleByHeaderHeight(16, 0.1),
            fontSize: this.scaleByHeaderHeight(16, 0.1),
            fontWeight: '500',
        };
    }
    infoStyle() {
        return {
            color: 'white',
            lineHeight: this.scaleByHeaderHeight(10, 0.1),
            fontSize: this.scaleByHeaderHeight(10, 0.1),
            opacity: this.scaleByHeaderHeight(1, 0),
            fontWeight: '300',
        };
    }

    contentStyle() {
        return [
            styles.content,
            {
                flex: 1,
                opacity: this.scaleByHeaderHeight(1, 0),
                overflow: 'hidden',
            },
        ];
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    bar: {
        width: '100%',
        position: 'absolute',
        zIndex: 1000,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowRadius: 2,
        shadowOpacity: 1,
        elevation: 0,
        backgroundColor: '#4f4c81',
    },
    content: {
        flex: 1,
        padding: 16,
        flexDirection: 'row',
    },
    scrollContainer: {
        paddingTop: HEADER_EXPANDED_HEIGHT,
    },
    image: {
        position: 'absolute',
        right: 0,
        width: '100%',
        resizeMode: 'cover',
    },
});
