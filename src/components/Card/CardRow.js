import React from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import styles, {colors, spacing} from '../../styles/index';

import MaterialIcons from 'react-native-vector-icons/Ionicons';


class CardRow extends React.Component {
  render() {
    const row = (
        <View style={styles.cardRow}>
            <Text style={{color: colors.purple, flex: 1}}>{this.props.primary}</Text>
            <Text style={{color: colors.purple, flex: 0}}>{this.props.secondary}</Text>
            {this.props.action && !this.props.menuItem && 
                <MaterialIcons name="ios-arrow-forward" 
                    size={16} 
                    style={{ color: colors.purple, paddingLeft: spacing.small, flex: 0 }} 
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