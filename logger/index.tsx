import { ERROR_FILE, ERROR_FILE_SIZE_LIMIT } from '@/_config';
import { useSendMobileLogsMutation } from '@/redux/apiServices/logsService';
import { formatISO } from 'date-fns';
// TODO Update to non-legacy filesystem
import * as FileSystem from 'expo-file-system/legacy';
import { useEffect } from 'react';
import { InteractionManager } from 'react-native';
import { fileAsyncTransport, logger } from 'react-native-logs';

const ERROR_PATH = `${FileSystem.documentDirectory}/${ERROR_FILE}`;
let LAST_SENT = 0;

type ExtraLogs = { [key: string]: string } & { zone?: string };

export const LOG = logger.createLogger({
    severity: 'error',
    transport: fileAsyncTransport,
    transportOptions: {
        // Custom FS implementation for expo-file-system
        FS: FileSystem,
        fileName: ERROR_FILE,
    },
    async: true,
    asyncFunc: InteractionManager.runAfterInteractions,
    dateFormat: (date) => formatISO(date),
    printDate: true,
    printLevel: true,
    fixedExtLvlLength: true,
    enabled: true,
    formatFunc: (level: string, extension: string | null, msg: [string, ExtraLogs]) => {
        const now = new Date();
        const { zone, ...other } = msg[1] ?? {};
        return `${formatISO(now, { representation: 'complete' })} ${zone ? `[${zone.toUpperCase()}]` : ''}
${msg[0]}
${Object.keys(other).length > 0 ? JSON.stringify(other, null, 2) : ''}`;
    },
});

export const readErrorLog = async (): Promise<string> => {
    const fileExists = await FileSystem.getInfoAsync(ERROR_PATH);
    return fileExists.exists
        ? await FileSystem.readAsStringAsync(ERROR_PATH, { encoding: FileSystem.EncodingType.UTF8 })
        : '';
};

export const clearErrorLog = async (): Promise<void> => {
    const fileExists = await FileSystem.getInfoAsync(ERROR_PATH);
    if (fileExists.exists) {
        await FileSystem.deleteAsync(ERROR_PATH, { idempotent: true });
    }
    await FileSystem.writeAsStringAsync(ERROR_PATH, '', { encoding: FileSystem.EncodingType.UTF8 });
};

export const useAutoLogging = (): void => {
    const [sendLogs, { isSuccess, reset, isError }] = useSendMobileLogsMutation();

    useEffect(() => {
        if (isSuccess) {
            clearErrorLog();
            reset();
            LAST_SENT = Date.now() / 1000;
        } else if (isError) {
            LOG.error('Failed to send logs to server', {
                zone: 'LOGS',
            });
            reset();
            LAST_SENT = Date.now() / 1000;
        }
    }, [isSuccess, isError, reset]);

    useEffect(() => {
        // Don't send logs if the last sent time is less than 4 hours
        if (LAST_SENT > Date.now() / 1000 - 60 * 60 * 4) {
            return;
        }
        // read the error log file size
        const checkFileSize = async (): Promise<void> => {
            const fileExists = await FileSystem.getInfoAsync(ERROR_PATH);
            if (fileExists.exists) {
                const stats = await FileSystem.getInfoAsync(ERROR_PATH);
                // if the file size is greater than the limit, send the logs to the server
                // @ts-ignore we know the size exists here
                if ((stats.size ?? 0) > ERROR_FILE_SIZE_LIMIT) {
                    sendLogs({
                        data: await FileSystem.readAsStringAsync(ERROR_PATH, {
                            encoding: FileSystem.EncodingType.UTF8,
                        }),
                    });
                }
            }
        };
        checkFileSize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
