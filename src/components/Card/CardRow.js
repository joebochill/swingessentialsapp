import React from 'react';
import { Text, View, TouchableHighlight, StyleSheet } from 'react-native';
import styles, {colors, spacing} from '../../styles/index';
import {scale, verticalScale, moderateScale} from '../../styles/dimension';

import MaterialIcons from 'react-native-vector-icons/Ionicons';


class CardRow extends React.Component {
  render() {
    const row = (
        <View style={StyleSheet.flatten([styles.cardRow, (this.props.customStyle ? this.props.customStyle: {})])}>
            <View style={{flex: 1, alignItems: 'stretch', justifyContent: 'center'}}>
                <Text style={{fontSize: scale(14), color: colors.purple, flex: 0, opacity: this.props.disabled ? 0.7 : 1}}>{this.props.primary}</Text>
                {this.props.subtitle && 
                    <Text style={{fontSize: scale(10), color: colors.purple, flex: 0, opacity: this.props.disabled ? 0.7 : 1}}>{this.props.subtitle}</Text>
                }
            </View>
            {this.props.secondary !== undefined && this.props.secondary !== '' &&
                <Text style={{fontSize: scale(14), color: colors.purple, flex: 0, opacity: this.props.disabled ? 0.7 : 1}}>{this.props.secondary}</Text>
            }
            {this.props.secondaryInput}
            {this.props.action && !this.props.menuItem && 
                <MaterialIcons name="ios-arrow-forward" 
                    size={scale(16)} 
                    style={{ fontSize: scale(14), color: colors.purple, paddingLeft: spacing.small, flex: 0, opacity: this.props.disabled ? 0.7 : 1 }} 
                />
            }
            {this.props.menuItem && this.props.selected &&
                <MaterialIcons name="ios-checkmark" 
                    size={scale(36)} 
                    style={{ color: colors.purple, paddingLeft: spacing.small, flex: 0, opacity: this.props.disabled ? 0.7 : 1 }} 
                />
            }
        </View>
    );
    return (this.props.action ? 
        <TouchableHighlight underlayColor={colors.purple} onPress={() => this.props.action()}>
            {row}
        </TouchableHighlight> : 
        row 
    );
  }
}

export default CardRow;