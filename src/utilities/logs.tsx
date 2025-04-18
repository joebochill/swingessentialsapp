import { logger, fileAsyncTransport } from 'react-native-logs';
import { InteractionManager } from 'react-native';
import * as RNFS from 'react-native-fs';
import { formatISO } from 'date-fns';
import { ERROR_FILE, ERROR_FILE_SIZE_LIMIT } from '../constants';
import { useEffect } from 'react';
import { useSendMobileLogsMutation } from '../redux/apiServices/logsService';

const ERROR_PATH = `${RNFS.DocumentDirectoryPath}/${ERROR_FILE}`;
let LAST_SENT = 0;

type ExtraLogs = { [key: string]: string } & { zone?: string };

export const LOG = logger.createLogger({
    severity: 'error',
    transport: fileAsyncTransport,
    transportOptions: {
        colors: {
            info: 'blueBright',
            warn: 'yellowBright',
            error: 'redBright',
        },
        // @ts-expect-error library types are wrong
        FS: RNFS,
        fileName: `${ERROR_FILE}`,
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
    const fileExists = await RNFS.exists(ERROR_PATH);
    return fileExists ? RNFS.readFile(ERROR_PATH, 'utf8') : '';
};

export const clearErrorLog = async (): Promise<void> => {
    const fileExists = await RNFS.exists(ERROR_PATH);
    if (fileExists) {
        await RNFS.unlink(ERROR_PATH);
    }
    await RNFS.writeFile(ERROR_PATH, '', 'utf8');
};

export const useAutoLogging = (): void => {
    const [sendLogs, { isSuccess, reset, isError }] = useSendMobileLogsMutation();

    useEffect(() => {
        if (isSuccess) {
            void clearErrorLog();
            reset();
            LAST_SENT = Date.now() / 1000;
        } else if (isError) {
            LOG.error('Failed to send logs to server', {
                zone: 'LOGS',
            });
            reset();
            LAST_SENT = Date.now() / 1000;
        }
    }, [isSuccess, isError]);

    useEffect(() => {
        // Don't send logs if the last sent time is less than 4 hours
        if (LAST_SENT > Date.now() / 1000 - 60 * 60 * 4) {
            return;
        }
        // read the error log file size
        const checkFileSize = async (): Promise<void> => {
            const fileExists = await RNFS.exists(ERROR_PATH);
            if (fileExists) {
                const stats = await RNFS.stat(ERROR_PATH);
                // if the file size is greater than the limit, send the logs to the server
                if (stats.size > ERROR_FILE_SIZE_LIMIT) {
                    sendLogs({
                        data: await RNFS.readFile(ERROR_PATH, 'utf8'),
                    });
                }
            }
        };
        checkFileSize();
    }, []);
};
