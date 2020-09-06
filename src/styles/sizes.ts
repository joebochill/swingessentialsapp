import { scale, verticalScale } from '../utilities/dimensions';
export const unit = (value: number) => value * scale(1);
export const spaceUnit = (value: number) => value * scale(4);

export const sizes = {
    xSmall: spaceUnit(3),
    small: spaceUnit(6),
    medium: spaceUnit(8),
    large: spaceUnit(12),
    xLarge: spaceUnit(16),
    jumbo: spaceUnit(24),
};
export const fonts = {
    10: unit(10),
    12: unit(12),
    14: unit(14),
    16: unit(16),
    18: unit(18),
    20: unit(20),
    24: unit(24),
};
export const spaces = {
    xSmall: spaceUnit(1), // 4
    small: spaceUnit(2), // 8
    medium: spaceUnit(4), // 16
    large: spaceUnit(6), // 24
    xLarge: spaceUnit(8), // 32
    jumbo: spaceUnit(12), // 48
};
