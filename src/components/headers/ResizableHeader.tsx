import React, { Component, ComponentType } from 'react';

// Components
import {
    Animated,
    ImageSourcePropType,
    StatusBar,
    StyleProp,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { AnimatedSafeAreaView } from '../../components';
import { MD3Theme, withTheme } from 'react-native-paper';

// Styles
import { blackOpacity } from '../../styles/colors';
// import { unit } from '../../styles/sizes';

// Utilities
// import color from 'color';
import { interpolate } from '../../utilities';

// Types
import { HeaderIcon } from '../types';
// import { $DeepPartial } from '@callstack/react-theme-provider';

// Constants
import { HEADER_COLLAPSED_HEIGHT, HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT_NO_STATUS } from '../../constants';
// import { theme as defaultTheme } from '../../styles/theme';

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
    },
    content: {
        flex: 1,
        flexDirection: 'row',
    },
    actionIcon: {
        height: HEADER_COLLAPSED_HEIGHT_NO_STATUS,
        // paddingHorizontal: defaultTheme.spaces.small,
        alignItems: 'center',
        justifyContent: 'center',
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
        // right: defaultTheme.spaces.small,
        height: HEADER_COLLAPSED_HEIGHT_NO_STATUS,
    },
    notFirst: {
        // marginLeft: defaultTheme.spaces.small,
    },
});

export type ResizableHeaderProps = {
    /** Header title */
    title: string;

    /** Optional header subtitle */
    subtitle?: string;

    /** Optional header third line of text (hidden when collapsed) */
    info?: string;

    /** Leftmost icon on header, used for navigation */
    navigation?: HeaderIcon;

    /** List of up to three action items on the right of the header */
    actionItems?: HeaderIcon[];

    /** Background color of the header */
    backgroundColor?: string;

    /** Color of the title, subtitle, and icons in the header */
    fontColor?: string;

    /** Background image to render when header is expanded */
    backgroundImage?: ImageSourcePropType;

    /** Height of the header */
    headerHeight: Animated.AnimatedInterpolation<number> | number;
    // headerHeight: number;

    /** Custom content for the header */
    headerContent?: JSX.Element;

    /**
     * Overrides for theme
     */
    theme?: MD3Theme; //$DeepPartial<ReactNativePaper.Theme>;
};

type HeaderState = {
    /* No State */
};

class HeaderClass extends Component<ResizableHeaderProps, HeaderState> {
    static readonly ICON_SIZE = 24;//defaultTheme.sizes.small;
    static readonly ICON_SPACING = 24;//defaultTheme.spaces.medium;

    render(): JSX.Element {
        const barStyle = this._barStyle();
        const contentStyle = this._contentStyle();

        return (
            <Animated.View style={[barStyle]}>
                <StatusBar barStyle={this._statusBarStyle()} />
                <AnimatedSafeAreaView style={[barStyle]}>
                    {this._backgroundImage()}
                    <Animated.View style={contentStyle}>
                        {this._navigation()}
                        {this._content()}
                        {this._actionItems()}
                    </Animated.View>
                </AnimatedSafeAreaView>
            </Animated.View>
        );
    }

    private _backgroundImage(): JSX.Element | undefined {
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
                        opacity: this._scaleByHeaderHeight(0.3, 0.2),
                    }}
                />
            );
        }
    }

    private _navigation(): JSX.Element | undefined {
        const { navigation, theme: theme } = this.props;
        if (navigation) {
            return (
                <View>
                    <TouchableOpacity
                        onPress={navigation.onPress}
                        style={[styles.actionIcon, /*{ marginRight: theme.spaces.small }*/]}
                    >
                        {this._icon(navigation.icon)}
                    </TouchableOpacity>
                </View>
            );
        }
    }

    /* eslint-disable-next-line @typescript-eslint/naming-convention */
    private _icon(IconClass: ComponentType<{ size: number; color: string }>): JSX.Element | undefined {
        if (IconClass) {
            return <IconClass size={HeaderClass.ICON_SIZE} color={this._fontColor()} />;
        }
    }

    private _content(): JSX.Element {
        const { headerContent } = this.props;
        if (headerContent) {
            return headerContent;
        }
        const content = [this._title(), this._info(), this._subtitle()];
        return (
            <Animated.View
                style={[
                    styles.titleContainer,
                    {
                        marginRight: this._scaleByHeaderHeight(0, this._actionPanelWidth()),
                    },
                ]}
            >
                <View style={{ flex: 0, justifyContent: 'center' }}>{content}</View>
            </Animated.View>
        );
    }

    private _title(): JSX.Element {
        const { title } = this.props;
        return (
            <Animated.Text key={'header-title'} style={this._titleStyle()} numberOfLines={1} ellipsizeMode={'tail'}>
                {title}
            </Animated.Text>
        );
    }

    private _subtitle(): JSX.Element | undefined {
        const { subtitle } = this.props;
        if (subtitle) {
            return (
                <Animated.Text
                    key={'header-subtitle'}
                    style={this._subtitleStyle()}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                >
                    {subtitle}
                </Animated.Text>
            );
        }
    }

    private _info(): JSX.Element | undefined {
        const { info } = this.props;
        if (info) {
            return (
                <Animated.Text key={'header-info'} style={this._infoStyle()} numberOfLines={1} ellipsizeMode={'tail'}>
                    {info}
                </Animated.Text>
            );
        }
    }

    private _actionItems(): JSX.Element | undefined {
        const { actionItems } = this.props;
        const items: HeaderIcon[] = actionItems || [];

        if (items) {
            return (
                <View style={styles.actionPanel}>
                    {items.slice(0, 3).map((actionItem, index) => (
                        <View key={`action_${index}`}>
                            <TouchableOpacity
                                onPress={actionItem.onPress}
                                style={[styles.actionIcon, index !== 0 ? styles.notFirst : {}]}
                            >
                                {this._icon(actionItem.icon)}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            );
        }
    }

    private _barStyle(): StyleProp<ViewStyle> {
        const { headerHeight } = this.props;
        return [
            styles.bar,
            {
                height: headerHeight as number,
                backgroundColor: this._backgroundColor(),
            },
        ];
    }

    private _contentStyle(): StyleProp<ViewStyle> {
        const { theme, headerContent, navigation } = this.props;
        const contractedPadding = this.props.subtitle
            // ? (HEADER_COLLAPSED_HEIGHT_NO_STATUS - (theme.fontSizes[20] + theme.fontSizes[18])) / 2
            // : (HEADER_COLLAPSED_HEIGHT_NO_STATUS - theme.fontSizes[20]) / 2;
            ? (HEADER_COLLAPSED_HEIGHT_NO_STATUS - (20 + 18)) / 2
            : (HEADER_COLLAPSED_HEIGHT_NO_STATUS - 20) / 2;
        return [
            styles.content,
            headerContent
                ? {} // no styles if you pass in custom content (Drawer)
                : {
                    //   paddingHorizontal: navigation ? theme.spaces.small : theme.spaces.medium,
                    paddingBottom: this._scaleByHeaderHeight(/*theme.spaces.xLarge*/48, contractedPadding) as number,
                },
        ];
    }

    private _titleStyle(): StyleProp<TextStyle> {
        const { theme } = this.props;
        return {
            color: this._fontColor(),
            lineHeight: this._scaleByHeaderHeight(30, /*theme.fontSizes[20]*/20) as number,
            // fontFamily: theme.fonts.semiBold.fontFamily,
            fontSize: this._scaleByHeaderHeight(30, /*theme.fontSizes[20]*/20) as number,
        };
    }

    private _subtitleStyle(): StyleProp<TextStyle> {
        const { theme } = this.props;
        return {
            color: this._fontColor(),
            lineHeight: 18,
            // fontFamily: theme.fonts.light.fontFamily,
            fontSize: 18,
        };
    }

    private _infoStyle(): StyleProp<TextStyle> {
        const { theme } = this.props;
        return {
            color: this._fontColor(),
            lineHeight: this._scaleByHeaderHeight(/*theme.fontSizes[20]*/20 * 1.05, 0.1) as number,
            opacity: this._scaleByHeaderHeight(1, 0) as number,
            // fontFamily: theme.fonts.regular.fontFamily,
            fontSize: this._scaleByHeaderHeight(/*theme.fontSizes[20]*/20, 0.1) as number,
        };
    }

    private _statusBarStyle(): 'light-content' | 'dark-content' {
        // return color(this._backgroundColor()).isDark() ? 'light-content' : 'dark-content';
        return 'dark-content';
    }

    private _fontColor(): string {
        const { fontColor, theme } = this.props;
        return fontColor || '';//theme.colors.onPrimary;
    }

    private _backgroundColor(): string {
        const { backgroundColor, theme } = this.props;
        return backgroundColor || '';//theme.colors.primary;
    }

    private _actionPanelWidth(): number {
        const { actionItems } = this.props;
        let length = actionItems ? actionItems.length : 0;
        if (length < 1) {
            return 0;
        }
        length = Math.min(3, length);
        return length * (HeaderClass.ICON_SIZE + HeaderClass.ICON_SPACING);
    }

    private _scaleByHeaderHeight(atLarge: number, atSmall: number): number | Animated.AnimatedInterpolation<number> {
        const { headerHeight } = this.props;
        if (typeof headerHeight === 'number') {
            return interpolate(
                headerHeight,
                {
                    min: HEADER_COLLAPSED_HEIGHT,
                    max: HEADER_EXPANDED_HEIGHT,
                },
                {
                    min: atSmall,
                    max: atLarge,
                }
            );
        }
        return headerHeight.interpolate({
            inputRange: [HEADER_COLLAPSED_HEIGHT, HEADER_EXPANDED_HEIGHT],
            outputRange: [atSmall, atLarge],
        });
    }
}

/**
 * Header component
 *
 * This component is used to display a title and navigation and action items on the top of a screen.
 * It can be tapped to expand or contract.
 */
/* @ts-ignore */
export const ResizableHeader = withTheme(HeaderClass);
