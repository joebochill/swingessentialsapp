import React from 'react'
import { Text, View } from 'react-native'
import { DrawerItems } from 'react-navigation'
import {connect} from 'react-redux';

function mapStateToProps(state){
    return {
        // username: state.userData.username
    };
}

class CustomDrawer extends React.Component {
  render() {
    return (
        <View>
            <View style={{height:120,backgroundColor:"green",justifyContent:'flex-end'}}>
                <Text style={{color:"white", fontSize: 24}}>{'Placeholder'}</Text>
            </View>
            <DrawerItems {...this.props} />{/* this.props merges the navigator props with the props we care about above (e.g.username) */}
        </View>
    )
  }
}

export default connect(mapStateToProps)(CustomDrawer);