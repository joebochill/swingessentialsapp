import React from 'react';
import {Text} from 'react-native';
import styles from '../styles/index';

// Returns a number rounded to the specified number of decimal places
export function roundNumber(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

export function formatText(text){
    if(!text){ return null;}
    let arr = text.split('|:::|');
    return arr.map((val, index) => 
      <Text key={'par_'+index} style={styles.paragraph}>{val}</Text>
    );
}