import { LOG_FILE, ERROR_FILE } from '../../constants';
import { getDate, getTime } from '../general';
import { useDispatch } from 'react-redux';
import { sendLogReport } from '../../redux/actions';

const RNFS = require('react-native-fs');
const error_path = `${RNFS.DocumentDirectoryPath}/${ERROR_FILE}`;
const log_path = `${RNFS.DocumentDirectoryPath}/${LOG_FILE}`

export type LOG_ERROR = {
    code: string | number;
    description: string;
    rawErrorCode?: string | number | null;
    rawErrorMessage?: string | null;
}

export type LOG_TYPE = 'ERROR' | 'LOGS';

export class Logger {
    public static async logMessage(message: string) {
        const timestamp = Date.now();
        const currentLog = await this.readMessages('LOGS');
        await RNFS.writeFile(log_path,
            currentLog +
            getDate(timestamp) + ' ' +
            getTime(timestamp) +
            ' (' + (timestamp / 1000).toFixed(0) +
            '):\r\n' +
            message +
            '\r\n\r\n', 'utf8'
        );
    }
    public static async logError(error: LOG_ERROR) {
        const errorMessage = `(${error.rawErrorCode || '--'}: ${error.rawErrorMessage || '--'})`;
        const composedMessage = `(${error.code}): ${error.description} ${errorMessage}`;

        const timestamp = Date.now();
        const currentLog = await this.readMessages('ERROR');
        await RNFS.writeFile(error_path,
            currentLog +
            getDate(timestamp) + ' ' +
            getTime(timestamp) +
            ' (' + (timestamp / 1000).toFixed(0) +
            '):\r\n' +
            composedMessage +
            '\r\n\r\n', 'utf8'
        );
    }
    public static async clear(type: LOG_TYPE) {
        const path = (type === 'ERROR') ? error_path : log_path;
        await RNFS.writeFile(path, '', 'utf8');
    }
    public static async readMessages(type: LOG_TYPE) {
        const path = (type === 'ERROR') ? error_path : log_path;
        const fileExists = await RNFS.exists(path);
        return fileExists ? RNFS.readFile(path, 'utf8') : '';
    }
    public static async sendEmail(type: LOG_TYPE) {
        const dispatch = useDispatch();
        const currentErrors = await this.readMessages(type);
        dispatch(sendLogReport(currentErrors, type));
    }
    private constructor() { }

}
