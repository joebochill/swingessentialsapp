import { atob } from './base64';
import { UserRole } from '../__types__';

export const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

// Returns a number rounded to the specified number of decimal places
export function roundNumber(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
}

// export function formatText(text){
//     if(!text){ return null;}
//     let arr = text.split('|:::|');
//     return arr.map((val, index) =>
//       <Text key={'par_'+index} style={styles.paragraph}>{val}</Text>
//     );
// }

export const getUserRole = (token: string): UserRole => {
    if (!token) {
        return 'anonymous';
    } else {
        return JSON.parse(atob(token.split('.')[1])).role;
    }
};

export function splitParagraphs(text: string) {
    if (!text) {
        return [];
    }
    return text.split('|:::|');
}

export function getDate(unix) {
    let day = new Date(unix);
    let dd = day.getUTCDate();
    let mm = day.getUTCMonth() + 1;
    let yyyy = day.getUTCFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    return yyyy + '-' + mm + '-' + dd;
}

export function getLongDate(unix) {
    const day = new Date(unix);
    return `${MONTHS[day.getUTCMonth()]} ${day.getUTCFullYear()}`;
}

export function getTime(unix) {
    let day = new Date(unix);
    let hh = day.getUTCHours();
    let mm = day.getUTCMinutes();
    let ss = day.getUTCSeconds();

    if (hh < 10) {
        hh = '0' + hh;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (ss < 10) {
        ss = '0' + ss;
    }

    return hh + ':' + mm + ':' + ss;
}

export function checkVersionGreater(test, against) {
    if (!test || typeof test !== 'string' || test.length < 5) {
        return false;
    }
    test = test.split('.', 3);
    const testNumeric = [];
    for (let i = 0; i < 3; i++) {
        testNumeric.push(parseInt(test[i], 10));
    }
    against = against.split('.', 3);
    const againstNumeric = [];
    for (let i = 0; i < 3; i++) {
        againstNumeric.push(parseInt(against[i], 10));
    }
    for (let i = 0; i < againstNumeric.length; i++) {
        if (testNumeric[i] === againstNumeric[i]) {
            continue;
        } else {
            return testNumeric[i] > againstNumeric[i];
        }
    }
    return true;
}

export const makeGroups = (list: Array<any>, bucketExtractor: Function): Array<BucketSection> => {
    let sections: BucketData = {};
    let ind = 0;
    for (let i = 0; i < list.length; i++) {
        const bucket = bucketExtractor(list[i]);
        if (!sections[bucket]) {
            sections[bucket] = {
                index: ind++,
                bucketName: bucket,
                data: [],
            };
        }
        sections[bucket].data.push(list[i]);
    }
    return Object.keys(sections)
        .map(i => sections[i])
        .sort((a, b) => a.index - b.index);
};

type Range = {
    min: number;
    max: number;
};
export const interpolate = (value: number, inputRange: Range, outputRange: Range) => {
    const ranges = [value, inputRange.max, inputRange.min];
    ranges.sort((b, a) => b - a);
    const rangedValue = ranges[1];
    const percent = (rangedValue - inputRange.min) / (inputRange.max - inputRange.min);
    return (outputRange.max - outputRange.min) * percent + outputRange.min;
};

type BucketSection = {
    index: number;
    bucketName: string;
    data: Array<any>;
};
type BucketData = {
    [key: string]: BucketSection;
};
