import { LOG_FILE, ERROR_FILE, ERROR_LIMIT, LOG_LIMIT } from '../../constants';
import { getDate, getTime } from '../general';
// import { sendLogReport } from '../../redux/actions/ExtraActions';
import Mailer from 'react-native-mail';
// import { store } from '../../redux/store';
import { Platform, Alert } from 'react-native';

const RNFS = require('react-native-fs');
const errorPath = `${RNFS.DocumentDirectoryPath}/${ERROR_FILE}`;
const logPath = `${RNFS.DocumentDirectoryPath}/${LOG_FILE}`;

export type LogError = {
    code: string | number;
    description: string;
    rawErrorCode?: string | number | null;
    rawErrorMessage?: string | null;
};

export type LogType = 'ERROR' | 'LOGS';
export let LAST_SENT = 0;
let SENDING = false;

export class Logger {
    public static setSending(isSending: boolean): void {
        SENDING = isSending;
    }
    public static isSending(): boolean {
        return SENDING;
    }
    public static async logMessage(message: string): Promise<void> {
        const timestamp = Date.now();
        const currentLog = await this.readMessages('LOGS');
        await RNFS.writeFile(
            logPath,
            `${currentLog}${getDate(timestamp)} ${getTime(timestamp)} (${(timestamp / 1000).toFixed(
                0
            )}):\r\n${message}\r\n\r\n`,
            'utf8'
        );
        if (currentLog.length + message.length > LOG_LIMIT) {
            if (LAST_SENT < Date.now() / 1000 - 60 * 60) {
                // don't try to send more than once per hour
                void this._autoSendEmail('LOGS');
                LAST_SENT = Date.now() / 1000;
            }
        }
    }
    public static async logError(error: LogError): Promise<void> {
        const errorMessage = `(${error.rawErrorCode || '--'}: ${error.rawErrorMessage || '--'})`;
        const composedMessage = `(${error.code}): ${error.description} ${errorMessage}`;

        const timestamp = Date.now();
        const currentLog = await this.readMessages('ERROR');

        await RNFS.writeFile(
            errorPath,
            `${currentLog + getDate(timestamp)} ${getTime(timestamp)} (${(timestamp / 1000).toFixed(
                0
            )}):\r\n${composedMessage}\r\n\r\n`,
            'utf8'
        );
        if (currentLog.length + composedMessage.length > ERROR_LIMIT) {
            void this._autoSendEmail('ERROR');
        }
    }
    public static async clear(type: LogType): Promise<void> {
        const path = type === 'ERROR' ? errorPath : logPath;
        await RNFS.writeFile(path, '', 'utf8');
    }
    public static async readMessages(type: LogType): Promise<string> {
        const path = type === 'ERROR' ? errorPath : logPath;
        const fileExists = await RNFS.exists(path);
        return fileExists ? RNFS.readFile(path, 'utf8') : '';
    }
    private static async _autoSendEmail(type: LogType): Promise<void> {
        if (SENDING) return;
        const currentErrors = await this.readMessages(type);
        // store.dispatch(sendLogReport(currentErrors, type));
    }
    public static async sendEmail(type: LogType, onDone: () => void = (): void => {}, username = ''): Promise<void> {
        const currentLogs = await this.readMessages(type);

        Mailer.mail(
            {
                subject: `Swing Essentials Error Report (${username})`,
                recipients: ['info@swingessentials.com'],
                body: `My Swing Essentials app has been encountering errors. ${
                    Platform.OS === 'ios'
                        ? 'Please see the attached error log.'
                        : `Please see the following:\r\n\r\n\r\n${currentLogs}`
                }`,
                isHTML: false,
                attachments:
                    Platform.OS === 'ios'
                        ? [
                              {
                                  path: type === 'ERROR' ? errorPath : logPath,
                                  type: 'doc',
                                  name: 'Logs.txt',
                              },
                          ]
                        : [],
            },
            (error, event) => {
                if (error && error === 'canceled') {
                    // Do nothing
                } else if (error) {
                    void this.logError({
                        code: 'LOGS100',
                        description: 'Error sending error logs',
                        rawErrorMessage: error,
                    });
                } else if (event && event === 'sent') {
                    // message sent successfully
                    void this.clear(type);
                    Alert.alert(
                        'Error Report Sent',
                        'Your error report has been submitted successfully. Thank you for helping us improve the app!',
                        [{ text: 'DONE', onPress: onDone }]
                    );
                } else if (event && (event === 'canceled' || event === 'cancelled' || event === 'cancel')) {
                    // do nothing
                } else if (event) {
                    void this.logError({
                        code: 'LOGS900',
                        description: 'Error sending error logs',
                        rawErrorMessage: event,
                    });
                }
            }
        );
    }
    private constructor() {}
}
