import { ERROR_FILE } from '@/_config';
import { formatISO } from 'date-fns';
import * as FileSystem from 'expo-file-system/legacy';
import { InteractionManager } from 'react-native';
import { fileAsyncTransport, logger } from 'react-native-logs';

export const LOG = logger.createLogger({
    severity: 'error',
    transport: fileAsyncTransport,
    transportOptions: {
        FS: FileSystem,
        fileName: ERROR_FILE,
        // fileSize: ERROR_FILE_SIZE_LIMIT, // Removed to fix lint error
    },
    async: true,
    asyncFunc: InteractionManager.runAfterInteractions,
    dateFormat: (date) => formatISO(date),
    printDate: true,
    printLevel: true,
    fixedExtLvlLength: true,
    enabled: true,
    formatFunc: (level: string, extension: string | null, msg: [string, Record<string, string>]) => {
        const now = new Date();
        const { zone, ...other } = msg[1] ?? {};
        return `${formatISO(now, { representation: 'complete' })} ${zone ? `[${zone.toUpperCase()}]` : ''}\n${msg[0]}\n${Object.keys(other).length > 0 ? JSON.stringify(other, null, 2) : ''}`;
    },
});
