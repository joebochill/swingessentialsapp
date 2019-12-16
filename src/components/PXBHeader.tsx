import React, { Component, ComponentType } from 'react';
import {
    Animated,
    ImageSourcePropType,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Platform,
    TouchableOpacity,
    View,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import color from 'color';
import { HeaderIcon } from './types';
import { withTheme, Theme, WithTheme } from '@pxblue/react-native-components';
import { $DeepPartial } from '@callstack/react-theme-provider';
import { purple, blackOpacity } from '../styles';

const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView);

export interface PXBHeaderProps {
    /** Header title */
    title: string;

    /** Optional header subtitle */
    subtitle?: string;

    /** Optional header third line of text (hidden when collapsed) */
    info?: string;

    /** Leftmost icon on header, used for navigation */
    navigation?: HeaderIcon;

    /** List of up to three action items on the right of the header */
    actionItems?: Array<HeaderIcon>;

    /** Background color of the header */
    backgroundColor?: string;

    /** Color of the title, subtitle, and icons in the header */
    fontColor?: string;

    /** Background image to render when header is expanded */
    backgroundImage?: ImageSourcePropType;

    /** Height of the header */
    headerHeight: Animated.AnimatedInterpolation;

    /**
     * Overrides for theme
     */
    theme?: $DeepPartial<Theme>;
}

interface HeaderState {}

class HeaderClass extends Component<WithTheme<PXBHeaderProps>, HeaderState> {
    static readonly REGULAR_HEIGHT = 56 + getStatusBarHeight(true);
    static readonly EXTENDED_HEIGHT = 200 + getStatusBarHeight(true);
    static readonly ICON_SIZE = 24;
    static readonly ICON_SPACING = 16;

    render() {
        const barStyle = this.barStyle();
        const contentStyle = this.contentStyle();

        return (
            <View style={styles.bar}>
                <StatusBar barStyle={this.statusBarStyle()} />
                <AnimatedSafeAreaView style={barStyle}>
                    {this.backgroundImage()}
                    <Animated.View style={contentStyle}>
                        {this.navigation()}
                        {this.content()}
                        {this.actionItems()}
                    </Animated.View>
                </AnimatedSafeAreaView>
            </View>
        );
    }

    private backgroundImage() {
        const { backgroundImage, headerHeight } = this.props;
        if (backgroundImage) {
            return (
                <Animated.Image
                    testID={'header-background-image'}
                    source={backgroundImage}
                    resizeMethod={'resize'}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        resizeMode: 'cover',
                        height: headerHeight,
                        opacity: headerHeight.interpolate({
                            inputRange: [HeaderClass.REGULAR_HEIGHT, HeaderClass.EXTENDED_HEIGHT],
                            outputRange: [0.2, 0.3],
                        }),
                    }}
                />
            );
        }
    }

    private navigation() {
        const { navigation } = this.props;
        if (navigation) {
            return (
                <View>
                    <TouchableOpacity
                        testID={'header-navigation'}
                        onPress={navigation.onPress}
                        style={styles.navigation}>
                        {this.icon(navigation.icon)}
                    </TouchableOpacity>
                </View>
            );
        }
    }

    private icon(IconClass: ComponentType<{ size: number; color: string }>) {
        if (IconClass) {
            return <IconClass size={HeaderClass.ICON_SIZE} color={this.fontColor()} />;
        }
    }

    private content() {
        const { headerHeight } = this.props;
        let content = [this.title(), this.info(), this.subtitle()];

        return (
            <Animated.View
                style={[
                    styles.titleContainer,
                    {
                        marginRight: headerHeight.interpolate({
                            inputRange: [HeaderClass.REGULAR_HEIGHT, HeaderClass.EXTENDED_HEIGHT],
                            outputRange: [this.actionPanelWidth(), 0],
                        }),
                    },
                ]}>
                <View style={{ flex: 0, justifyContent: 'center' }}>{content}</View>
            </Animated.View>
        );
    }

    private title() {
        const { title } = this.props;
        return (
            <Animated.Text
                key="title_key"
                testID={'header-title'}
                style={this.titleStyle()}
                numberOfLines={1}
                ellipsizeMode={'tail'}>
                {title}
            </Animated.Text>
        );
    }

    private subtitle() {
        const { subtitle } = this.props;
        if (subtitle) {
            return (
                <Animated.Text
                    key="subtitle_key"
                    testID={'header-subtitle'}
                    style={this.subtitleStyle()}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {subtitle}
                </Animated.Text>
            );
        }
    }

    private info() {
        const { info } = this.props;
        if (info) {
            return (
                <Animated.Text
                    key="info_key"
                    testID={'header-info'}
                    style={this.infoStyle()}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {info}
                </Animated.Text>
            );
        }
    }

    private actionItems() {
        const { actionItems } = this.props;
        let items: HeaderIcon[] = actionItems || [];

        if (items) {
            return (
                <View style={styles.actionPanel}>
                    {items.slice(0, 3).map((actionItem, index) => (
                        <View key={`action_${index}`}>
                            <TouchableOpacity
                                testID={`header-action-item${index}`}
                                onPress={actionItem.onPress}
                                style={index !== 0 ? styles.actionItem : {}}>
                                {this.icon(actionItem.icon)}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            );
        }
    }

    private barStyle() {
        const { headerHeight } = this.props;
        return [
            styles.bar,
            {
                height: headerHeight,
                backgroundColor: this.backgroundColor(),
            },
        ];
    }

    private contentStyle() {
        const { headerHeight } = this.props;
        const contractedPadding = this.props.subtitle ? 12 : 16;
        return [
            styles.content,
            {
                paddingBottom: headerHeight.interpolate({
                    inputRange: [HeaderClass.REGULAR_HEIGHT, HeaderClass.EXTENDED_HEIGHT],
                    outputRange: [contractedPadding, 28],
                }),
            },
        ];
    }

    private titleStyle() {
        const { theme, headerHeight } = this.props;
        return {
            color: this.fontColor(),
            lineHeight: headerHeight.interpolate({
                inputRange: [HeaderClass.REGULAR_HEIGHT, HeaderClass.EXTENDED_HEIGHT],
                outputRange: [theme.sizes.large, 30],
            }),
            fontFamily: theme.fonts.semiBold.fontFamily,
            fontSize: headerHeight.interpolate({
                inputRange: [HeaderClass.REGULAR_HEIGHT, HeaderClass.EXTENDED_HEIGHT],
                outputRange: [theme.sizes.large, 30],
            }),
        };
    }

    private subtitleStyle() {
        const { theme } = this.props;
        return {
            color: this.fontColor(),
            lineHeight: 18,
            fontFamily: theme.fonts.light.fontFamily,
            fontSize: 18,
        };
    }

    private infoStyle() {
        const { theme, headerHeight } = this.props;
        return {
            color: this.fontColor(),
            lineHeight: headerHeight.interpolate({
                inputRange: [HeaderClass.REGULAR_HEIGHT, HeaderClass.EXTENDED_HEIGHT],
                outputRange: [0.1, theme.sizes.large * 1.05], // Avoid clipping top of CAP letters
            }),
            opacity: headerHeight.interpolate({
                inputRange: [HeaderClass.REGULAR_HEIGHT, HeaderClass.EXTENDED_HEIGHT],
                outputRange: [0, 1],
            }),
            fontFamily: theme.fonts.regular.fontFamily,
            fontSize: headerHeight.interpolate({
                inputRange: [HeaderClass.REGULAR_HEIGHT, HeaderClass.EXTENDED_HEIGHT],
                outputRange: [0.1, theme.sizes.large],
            }),
        };
    }

    private statusBarStyle() {
        return color(this.backgroundColor()).isDark() ? 'light-content' : 'dark-content';
    }

    private fontColor() {
        const { fontColor, theme } = this.props;
        return fontColor || theme.colors.onPrimary;
    }

    private backgroundColor() {
        const { backgroundColor, theme } = this.props;
        return backgroundColor || theme.colors.primary;
    }

    private actionPanelWidth() {
        const { actionItems } = this.props;
        let length = actionItems ? actionItems.length : 0;
        if (length < 1) {
            return 0;
        }
        length = Math.min(3, length);
        return length * (HeaderClass.ICON_SIZE + HeaderClass.ICON_SPACING);
    }
}

/**
 * Header component
 *
 * This component is used to display a title and navigation and action items on the top of a screen.
 * It can be tapped to expand or contract.
 */
export const PXBHeader = withTheme(HeaderClass);

const styles = StyleSheet.create({
    bar: {
        width: '100%',
        top: 0,
        left: 0,
        paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
        position: 'absolute',
        justifyContent: 'flex-end',
        zIndex: 1000,
        shadowColor: blackOpacity(0.3),
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowRadius: 2,
        shadowOpacity: 1,
        elevation: 0,
        backgroundColor: purple[400],
    },
    content: {
        flex: 1,
        paddingTop: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
    },
    navigation: {
        marginRight: 32,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    actionPanel: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        right: 16,
        height: 56,
    },
    actionItem: {
        marginLeft: 16,
    },
});
