import { Dimensions } from 'react-native';
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 400;
const guidelineBaseHeight = 680;

const scale = (size: number): number => (deviceWidth / guidelineBaseWidth) * size;
const verticalScale = (size: number): number => (deviceHeight / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5): number => size + (scale(size) - size) * factor;
const aspectHeight = (width: number): number => (width * 9) / 16;
const aspectWidth = (height: number): number => (height * 16) / 9;

export { deviceWidth as width, deviceHeight as height, scale, verticalScale, moderateScale, aspectHeight, aspectWidth };
