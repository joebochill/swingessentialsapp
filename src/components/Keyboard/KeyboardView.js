import React from 'react';
import { View, ScrollView, Animated, Keyboard, Platform, StyleSheet } from 'react-native';
import styles, {colors, spacing} from '../../styles/index';


class KeyboardView extends React.Component {
    constructor(props){
        super(props);
        this.state={};
        this.keyboardHeight = new Animated.Value(spacing.normal);
    }
    componentWillMount () {
        if(Platform.OS === 'ios'){
            this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
            this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
        }
        else{
            this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
            this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
        }
    }
    componentWillUnmount() {
        if(Platform.OS === 'ios'){
            this.keyboardWillShowSub.remove();
            this.keyboardWillHideSub.remove();
        }
        else{
            this.keyboardDidShowSub.remove();
            this.keyboardDidHideSub.remove();
        }
        
    }
    keyboardWillShow = (event) => {
        Animated.parallel([
          Animated.timing(this.keyboardHeight, {
            duration: event.duration,
            toValue: event.endCoordinates.height+spacing.normal,
          })
        ]).start();
    };
    keyboardDidShow = (event) => {
        this.keyboardHeight = event.endCoordinates.height+spacing.normal;
        this.forceUpdate();
    }
    
    keyboardWillHide = (event) => {
        Animated.parallel([
          Animated.timing(this.keyboardHeight, {
            duration: event.duration,
            toValue: spacing.normal,
          })
        ]).start();
    };
    keyboardDidHide = () => {
        this.keyboardHeight = spacing.normal;
        this.forceUpdate();
    }
    render() {
        return (
            <Animated.View style={{
                flex: 1,
                backgroundColor: this.props.backgroundColor,
                paddingBottom: this.keyboardHeight,
                paddingTop: spacing.normal
            }}>
                <ScrollView style={{
                    flex: 1,
                    paddingRight: spacing.normal, 
                    paddingLeft: spacing.normal
                }}>
                    {this.props.children}
                </ScrollView>
                {this.props.fixed && 
                    <View style={{
                        flex: 0,
                        paddingRight: spacing.normal, 
                        borderTopWidth: 1,
                        borderTopColor: colors.borderGrey,
                        paddingLeft: spacing.normal
                    }}>
                        {this.props.fixed}
                    </View>
                }
            </Animated.View>
        );
    }
}

export default KeyboardView;