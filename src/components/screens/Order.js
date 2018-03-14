import React from 'react';
import {connect} from 'react-redux';

import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  FlatList, 
  StatusBar, 
  TouchableOpacity 
} from 'react-native';

// import LoginStatusMessage from './LoginStatusMessage';
// import AuthButton from './AuthButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#000000',
  },
  historyRow:{
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    // backgroundColor: 'green'
  },
  historyItemLeft:{
    flex: 1,
    textAlign: 'left',
    color: 'white',
    fontSize: 16
  },
  historyItemRight:{
    flex: 1,
    textAlign: 'right',
    color: 'white',
    fontSize: 24
  },
  fail:{
    backgroundColor: 'red'
  }
});


function mapStateToProps(state){
  return {};
}

function mapDispatchToProps(dispatch){
  return {};
}

class MyListItem extends React.PureComponent {
  // _onPress = () => {
  //   this.props.onPressItem(this.props.id);
  // };

  render() {
    const failstyle = this.props.fail ? styles.fail : {};
    return (
      // <TouchableOpacity onPress={()=>alert('clicked')}>
        <View style={[styles.historyRow, failstyle]}>
          <Text style={styles.historyItemLeft}>
            FRI, FEB 2
          </Text>
          <Text style={styles.historyItemRight}>
            {this.props.title}
          </Text>
        </View>
      // </TouchableOpacity>
    );
  }
}

class MainScreen extends React.Component{
  constructor(props){
    super(props);
  }

  componentWillReceiveProps(nextProps){

  }

  _renderItem = ({item}) => (
    <MyListItem
      id={item.key}
      //onPressItem={this._onPressItem}
      //selected={!!this.state.selected.get(item.id)}
      fail={Math.random()<0.3}
      title={item.val}
    />
  );

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <FlatList
            data={[{key: 'a', val:'220 LB'}, {key: 'b', val:'220 LB'}, {key: 'c', val:'220 LB'}, {key: 'd', val:'220 LB'}, {key: 'e', val:'220 LB'}, {key: 'f', val:'220 LB'}, {key: 'g', val:'220 LB'}, {key: 'h', val:'220 LB'}, {key: 'i', val:'220 LB'}, {key: 'j', val:'220 LB'}, {key: 'k', val:'220 LB'}, {key: 'l', val:'220 LB'}, {key: 'm', val:'220 LB'}, {key: 'n', val:'220 LB'}, {key: 'o', val:'220 LB'}, {key: 'p', val:'220 LB'}, {key: 'q', val:'220 LB'},
                    {key: 'r', val:'220 LB'}, {key: 's', val:'220 LB'}, {key: 't', val:'220 LB'}, {key: 'u', val:'220 LB'}, {key: 'v', val:'220 LB'}, {key: 'w', val:'220 LB'}, {key: 'x', val:'220 LB'}, {key: 'y', val:'220 LB'}, {key: 'z', val:'220 LB'}, {key: 'aa', val:'220 LB'}, {key: 'bb', val:'220 LB'}, {key: 'cc', val:'220 LB'}, {key: 'dd', val:'220 LB'}, {key: 'ee', val:'220 LB'}, {key: 'ff', val:'220 LB'}, {key: 'gg', val:'220 LB'}, {key: 'hh', val:'220 LB'}]}
            renderItem={this._renderItem}
          />
        </View>
      </View>
    );
  }
}

// const MainScreen = () => (
//   <View style={styles.container}>
//     {/* <LoginStatusMessage /> */}
//     {/* <AurthButton /> */}
//   </View>
// );

// MainScreen.navigationOptions = {
//   // title: 'Home Screen',
//   headerTintColor: 'black',
//   headerStyle:{
//     backgroundColor: 'black'
//   },
//   headerTitle:<View style={{backgroundColor: 'black'}}>
//           {/* <StatusBar
//           backgroundColor="blue"
//           barStyle="light-content"
//         /> */}
//         <Image style={{height: 44, width:125}} source={require('../../images/squattrack.png')}/>
//       </View>
// };

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
