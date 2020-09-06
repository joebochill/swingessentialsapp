import { LOG_FILE, ERROR_FILE, ERROR_LIMIT, LOG_LIMIT } from '../../constants';
import { getDate, getTime } from '../general';
import { sendLogReport } from '../../redux/actions/ExtraActions';
import Mailer from 'react-native-mail';
import { store } from '../../redux/store';
import { Platform, Alert } from 'react-native';

const RNFS = require('react-native-fs');
const error_path = `${RNFS.DocumentDirectoryPath}/${ERROR_FILE}`;
const log_path = `${RNFS.DocumentDirectoryPath}/${LOG_FILE}`;

export type LOG_ERROR = {
    code: string | number;
    description: string;
    rawErrorCode?: string | number | null;
    rawErrorMessage?: string | null;
};

export type LOG_TYPE = 'ERROR' | 'LOGS';
export let LAST_SENT: number = 0;

export class Logger {
    public static async logMessage(message: string) {
        const timestamp = Date.now();
        const currentLog = await this.readMessages('LOGS');
        await RNFS.writeFile(
            log_path,
            currentLog +
                getDate(timestamp) +
                ' ' +
                getTime(timestamp) +
                ' (' +
                (timestamp / 1000).toFixed(0) +
                '):\r\n' +
                message +
                '\r\n\r\n',
            'utf8',
        );
        if (currentLog.length + message.length > LOG_LIMIT) {
            if (LAST_SENT < Date.now() / 1000 - 60 * 60) {
                // don't try to send more than once per hour
                this.autoSendEmail('LOGS');
                LAST_SENT = Date.now() / 1000;
            }
        }
    }
    public static async logError(error: LOG_ERROR) {
        const errorMessage = `(${error.rawErrorCode || '--'}: ${error.rawErrorMessage || '--'})`;
        const composedMessage = `(${error.code}): ${error.description} ${errorMessage}`;

        const timestamp = Date.now();
        const currentLog = await this.readMessages('ERROR');

        await RNFS.writeFile(
            error_path,
            currentLog +
                getDate(timestamp) +
                ' ' +
                getTime(timestamp) +
                ' (' +
                (timestamp / 1000).toFixed(0) +
                '):\r\n' +
                composedMessage +
                '\r\n\r\n',
            'utf8',
        );
        if (currentLog.length + composedMessage.length > ERROR_LIMIT) {
            this.autoSendEmail('ERROR');
        }
    }
    public static async clear(type: LOG_TYPE) {
        const path = type === 'ERROR' ? error_path : log_path;
        await RNFS.writeFile(path, '', 'utf8');
    }
    public static async readMessages(type: LOG_TYPE) {
        const path = type === 'ERROR' ? error_path : log_path;
        const fileExists = await RNFS.exists(path);
        return fileExists ? RNFS.readFile(path, 'utf8') : '';
    }
    private static async autoSendEmail(type: LOG_TYPE) {
        const currentErrors = await this.readMessages(type);
        store.dispatch(sendLogReport(currentErrors, type));
    }
    public static async sendEmail(type: LOG_TYPE, onDone: Function = () => {}, username: string = '') {
        const currentLogs = await this.readMessages(type);

        Mailer.mail(
            {
                subject: `Swing Essentials Error Report (${username})`,
                recipients: ['info@swingessentials.com'],
                body: `My Swing Essentials app has been encountering errors. ${
                    Platform.OS === 'ios'
                        ? 'Please see the attached error log.'
                        : 'Please see the following:\r\n\r\n\r\n' + currentLogs
                }`,
                isHTML: false,
                attachment:
                    Platform.OS === 'ios'
                        ? {
                              path: type === 'ERROR' ? error_path : log_path,
                              type: 'doc',
                              name: 'Logs.txt',
                          }
                        : null,
            },
            (error, event) => {
                if (error && error === 'canceled') {
                    // Do nothing
                } else if (error) {
                    this.logError({
                        code: 'LOGS100',
                        description: 'Error sending error logs',
                        rawErrorMessage: error,
                    });
                } else if (event && event === 'sent') {
                    // message sent successfully
                    this.clear(type);
                    Alert.alert(
                        'Error Report Sent',
                        'Your error report has been submitted successfully. Thank you for helping us improve the app!',
                        [{ text: 'DONE', onPress: onDone ? () => onDone() : () => {} }],
                    );
                } else if (event && (event === 'canceled' || event === 'cancelled' || event === 'cancel')) {
                    // do nothing
                } else if (event) {
                    this.logError({
                        code: 'LOGS900',
                        description: 'Error sending error logs',
                        rawErrorMessage: event,
                    });
                }
            },
        );
    }
    private constructor() {}
}
