import React, { Component, ComponentType } from 'react';
import {
    Animated,
    ImageSourcePropType,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    View,
} from 'react-native';
import color from 'color';
import { HeaderIcon } from '../types';
import { withTheme, Theme, WithTheme } from '@pxblue/react-native-components';
import { $DeepPartial } from '@callstack/react-theme-provider';
import { purple, blackOpacity, unit } from '../../styles';
import { AnimatedSafeAreaView } from '../../components';
import { HEADER_COLLAPSED_HEIGHT, HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT_NO_STATUS } from '../../constants';
import { interpolate } from '../../utilities';

export interface ResizableHeaderProps {
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
    // headerHeight: number;

    /**
     * Overrides for theme
     */
    theme?: $DeepPartial<Theme>;
}

interface HeaderState { }

class HeaderClass extends Component<WithTheme<ResizableHeaderProps>, HeaderState> {
    static readonly ICON_SIZE = unit(24);
    static readonly ICON_SPACING = unit(16);

    render() {
        const barStyle = this.barStyle();
        const contentStyle = this.contentStyle();

        return (
            <Animated.View style={[barStyle]}>
                <StatusBar barStyle={this.statusBarStyle()} />
                <AnimatedSafeAreaView style={[barStyle]}>
                    {this.backgroundImage()}
                    <Animated.View style={contentStyle}>
                        {this.navigation()}
                        {this.content()}
                        {this.actionItems()}
                    </Animated.View>
                </AnimatedSafeAreaView>
            </Animated.View>
        );
    }

    private backgroundImage() {
        const { backgroundImage, headerHeight } = this.props;
        if (backgroundImage) {
            return (
                <Animated.Image
                    source={backgroundImage}
                    resizeMethod={'resize'}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        resizeMode: 'cover',
                        height: headerHeight,
                        opacity: this.scaleByHeaderHeight(0.3, 0.2),
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
                        onPress={navigation.onPress}
                        style={[styles.navigation]}>
                        {this.icon(navigation.icon)}
                    </TouchableOpacity>
                </View>
            );
        }
    }

    private icon(IconClass: ComponentType<{ size: number; color: string }>) {
        if (IconClass) {
            return <IconClass size={unit(24)} color={this.fontColor()} />;
        }
    }

    private content() {
        let content = [this.title(), this.info(), this.subtitle()];
        return (
            <Animated.View
                style={[
                    styles.titleContainer,
                    {
                        marginRight: this.scaleByHeaderHeight(0, this.actionPanelWidth()),
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
        const { theme } = this.props;
        const contractedPadding = this.props.subtitle ?
            (HEADER_COLLAPSED_HEIGHT_NO_STATUS - (theme.sizes.large + 18)) / 2 :
            (HEADER_COLLAPSED_HEIGHT_NO_STATUS - (theme.sizes.large)) / 2;
        return [
            styles.content,
            { paddingBottom: this.scaleByHeaderHeight(unit(28), contractedPadding) }
        ];
    }

    private titleStyle() {
        const { theme } = this.props;
        return {
            color: this.fontColor(),
            lineHeight: this.scaleByHeaderHeight(30, theme.sizes.large),
            fontFamily: theme.fonts.semiBold.fontFamily,
            fontSize: this.scaleByHeaderHeight(30, theme.sizes.large),
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
        const { theme } = this.props;
        return {
            color: this.fontColor(),
            lineHeight: this.scaleByHeaderHeight(theme.sizes.large * 1.05, 0.1),
            opacity: this.scaleByHeaderHeight(1, 0),
            fontFamily: theme.fonts.regular.fontFamily,
            fontSize: this.scaleByHeaderHeight(theme.sizes.large, 0.1),
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

    private scaleByHeaderHeight(atLarge: number, atSmall: number) {
        const { headerHeight } = this.props;
        if (typeof headerHeight === 'number') {
            return interpolate(
                headerHeight,
                {
                    min: HEADER_COLLAPSED_HEIGHT,
                    max: HEADER_EXPANDED_HEIGHT
                },
                {
                    min: atSmall,
                    max: atLarge
                }
            );
        }
        return headerHeight.interpolate({
            inputRange: [HEADER_COLLAPSED_HEIGHT, HEADER_EXPANDED_HEIGHT],
            outputRange: [atSmall, atLarge]
        })

    }
}

/**
 * Header component
 *
 * This component is used to display a title and navigation and action items on the top of a screen.
 * It can be tapped to expand or contract.
 */
export const ResizableHeader = withTheme(HeaderClass);

const styles = StyleSheet.create({
    bar: {
        width: '100%',
        left: 0,
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
        paddingHorizontal: unit(16),
        flexDirection: 'row',
    },
    navigation: {
        height: HeaderClass.ICON_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: unit(16),
        marginRight: unit(32),
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
        right: HeaderClass.ICON_SPACING,
        height: HEADER_COLLAPSED_HEIGHT_NO_STATUS,
    },
    actionItem: {
        height: HeaderClass.ICON_SIZE,
        marginLeft: HeaderClass.ICON_SPACING,
    },
});
