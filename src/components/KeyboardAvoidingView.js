import React from 'react';
import { View, ScrollView, RefreshControl, Animated, Keyboard, Platform, StyleSheet } from 'react-native';
import { colors, spacing } from '../styles/index';


class KeyboardAvoidingView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.keyboardHeight = new Animated.Value(spacing.normal);
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
            this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
        }
    }
    componentWillUnmount() {
        if (Platform.OS === 'ios') {
            this.keyboardWillShowSub.remove();
            this.keyboardWillHideSub.remove();
        }
    }

    render() {
        const { onRefresh, refreshing,
            footer,
            scrollStyle,
            children,
            style
        } = this.props;

        return (
            <Animated.View style={StyleSheet.flatten([
                styles.container,
                { paddingBottom: this.keyboardHeight },
                style
            ])}>
                <ScrollView
                    keyboardShouldPersistTaps={'always'}
                    contentContainerStyle={StyleSheet.flatten([
                        { paddingBottom: footer ? spacing.normal : 0 },
                        scrollStyle
                    ])}
                    refreshControl={onRefresh ?
                        <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} />
                        : null
                    }
                    style={styles.scroll}
                >
                    {children}
                </ScrollView>
                {footer &&
                    <View style={styles.footer}>
                        {footer}
                    </View>
                }
            </Animated.View>
        );
    }

    keyboardWillShow = (event) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: event.endCoordinates.height + spacing.normal,
            })
        ]).start();
    };
    keyboardWillHide = (event) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: spacing.normal,
            })
        ]).start();
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: spacing.normal
    },
    scroll: {
        paddingRight: spacing.normal,
        paddingLeft: spacing.normal
    },
    footer: {
        flex: 0,
        paddingRight: spacing.normal,
        borderTopWidth: 1,
        borderTopColor: colors.borderGrey,
        paddingLeft: spacing.normal
    }
});

export default KeyboardAvoidingView;