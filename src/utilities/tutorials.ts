import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_VERSION, ASYNC_PREFIX, TUTORIAL_VERSIONS, TUTORIALS } from '../constants';

export function checkVersionGreater(test: string, against: string): boolean {
    if (!test || typeof test !== 'string' || test.length < 5) {
        return false;
    }
    const testArray = test.split('.', 3);
    const testNumeric = [];
    for (let i = 0; i < 3; i++) {
        testNumeric.push(parseInt(testArray[i], 10));
    }
    const againstArray = against.split('.', 3);
    const againstNumeric = [];
    for (let i = 0; i < 3; i++) {
        againstNumeric.push(parseInt(againstArray[i], 10));
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

export const setTutorialWatched = async (tutorialKey: keyof typeof TUTORIALS): Promise<void> => {
    await AsyncStorage.setItem(`${ASYNC_PREFIX}${tutorialKey}`, APP_VERSION);
};

export const newTutorialAvailable = async (tutorialKey: keyof typeof TUTORIALS): Promise<boolean> => {
    const lastTutorialWatched = await AsyncStorage.getItem(`${ASYNC_PREFIX}${tutorialKey}`);
    if (!lastTutorialWatched) return true;

    const tutorialRequiredAt = TUTORIAL_VERSIONS[tutorialKey];

    // if last watched is less than current required
    return isVersionGreater(tutorialRequiredAt, lastTutorialWatched);
};

export const isVersionGreater = (source: string, target: string): boolean => {
    const parseVersion = (version: string): number[] => version.split('.').map((num) => parseInt(num, 10) || 0);

    const [sourceVersion, targetVersion] = [parseVersion(source), parseVersion(target)];

    for (let i = 0; i < Math.max(sourceVersion.length, targetVersion.length); i++) {
        const num1 = sourceVersion[i] || 0; // Default to 0 if index is out of bounds
        const num2 = targetVersion[i] || 0;
        if (num1 > num2) return true;
        if (num1 < num2) return false;
    }
    return false; // Versions are equal
};
