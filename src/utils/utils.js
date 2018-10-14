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

export function getDate(unix){
    let day = new Date(unix);
    let dd = day.getUTCDate();
    let mm = day.getUTCMonth()+1; 
    let yyyy = day.getUTCFullYear();
    if(dd<10){dd='0'+dd;} 
    if(mm<10) {mm='0'+mm;} 
    return (yyyy + '-' + mm + '-' + dd);
}