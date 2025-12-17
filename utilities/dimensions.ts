import { Dimensions } from 'react-native';
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const aspectHeight = (width: number): number => (width * 9) / 16;
const aspectWidth = (height: number): number => (height * 16) / 9;

export { deviceWidth as width, deviceHeight as height, aspectHeight, aspectWidth };
