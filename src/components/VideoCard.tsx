import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import * as Typography from '@pxblue/react-native-components/core/typography';
import { black } from '@pxblue/colors';
import { YouTube } from './Youtube';
import { withTheme, WithTheme, Theme } from '@pxblue/react-native-components';
import { $DeepPartial } from '@callstack/react-theme-provider';
import { Icon } from 'react-native-elements';
import { width, aspectHeight } from '../utilities';
import { spaces, unit } from '../styles';

export interface VideoCardProps {
    headerColor?: string;
    headerTitle: string;
    headerSubtitle?: string;
    headerFontColor?: string;
    style?: StyleProp<ViewStyle>;
    video?: string;
    hiddenContent?: JSX.Element;
    onExpand?: Function;
    theme?: $DeepPartial<Theme>;
}

class VideoCardClass extends Component<WithTheme<VideoCardProps>> {
    public render() {
        const { video, theme, headerColor = theme.colors.primary, hiddenContent } = this.props;
        const videoWidth = width - 2 * spaces.medium;
        const videoHeight = aspectHeight(videoWidth);

        return (
            <View style={[this.cardStyle()]}>
                <View style={this.innerWrapperStyle()}>
                    <View style={[styles.header, { backgroundColor: headerColor }]}>
                        {this.headerText()}
                        {this.actionItems()}
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        {video && <YouTube videoId={video} style={{ width: videoWidth, height: videoHeight }} />}
                        {hiddenContent}
                    </View>
                </View>
            </View>
        );
    }

    private headerText() {
        const { headerTitle, headerSubtitle } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <Typography.Label style={{ color: this.fontColor() }}>{headerTitle}</Typography.Label>
                {headerSubtitle ? (
                    <Typography.Subtitle style={{ color: this.fontColor() }} font={'regular'}>
                        {headerSubtitle}
                    </Typography.Subtitle>
                ) : null}
            </View>
        );
    }

    private cardStyle(): StyleProp<ViewStyle> {
        const { style, theme } = this.props;
        const newStyle = {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.roundness,
        };
        return [styles.card, newStyle, style];
    }
    private innerWrapperStyle(): StyleProp<ViewStyle> {
        const { theme } = this.props;
        return {
            borderRadius: theme.roundness,
            overflow: 'hidden',
        };
    }

    private actionItems() {
        const { onExpand } = this.props;
        return onExpand ? (
            <TouchableOpacity onPress={() => onExpand()} style={styles.actionItem}>
                <Icon name={'open-in-new'} color={this.fontColor()} />
            </TouchableOpacity>
        ) : null;
    }

    private fontColor() {
        const { headerFontColor, theme } = this.props;
        return headerFontColor || theme.colors.onPrimary;
    }
}

export const VideoCard = withTheme(VideoCardClass);

const styles = StyleSheet.create({
    actionItem: {
        marginLeft: spaces.small,
    },
    card: {
        shadowColor: black[900],
        shadowOpacity: 0.4,
        shadowRadius: 3,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        elevation: 1,
        flex: 1,
    },
    header: {
        height: unit(56),
        paddingHorizontal: spaces.medium,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
