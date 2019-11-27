
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
export function splitParagraphs(text: string){
    if(!text) { return []}
    return text.split('|:::|');
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

export function getLongDate(unix){
    const day = new Date(unix);
    return ( `${MONTHS[day.getUTCMonth()]} ${day.getUTCFullYear()}`);
}

export function getTime(unix){
    let day = new Date(unix);
    let hh = day.getUTCHours();
    let mm = day.getUTCMinutes();
    let ss = day.getUTCSeconds();

    if(hh<10){hh='0'+hh;} 
    if(mm<10){mm='0'+mm;} 
    if(ss<10){ss='0'+ss;} 

    return (hh + ':' + mm + ':' + ss);
}

export function checkVersionGreater(test, against){
    if(!test || typeof test !== 'string' || test.length < 5){return false;}
    test = test.split('.', 3);
    test.map((item) => parseInt(item, 10));
    against = against.split('.', 3);
    against.map((item) => parseInt(item, 10));
    for(let i = 0; i < against.length; i++){

        if(test[i] === against[i]){continue}
        else{
            return (test[i] > against[i]);
        }
    }
    return true;
}
