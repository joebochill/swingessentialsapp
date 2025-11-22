import { UserAppSettings, UserNotificationSettings } from '../../../redux/apiServices/userDetailsService';

export type SettingType = {
    name: keyof UserAppSettings | keyof UserNotificationSettings;
    label: string;
    description: string;
    values: number[] | string[] | boolean[];
    labels?: string[];
};
export const SETTINGS: SettingType[] = [
    {
        name: 'handed',
        label: 'Swing Handedness',
        description: 'Your dominant hand for golfing',
        values: ['right', 'left'],
        labels: ['Right', 'Left'],
    },
    {
        name: 'camera_duration',
        label: 'Recording Duration',
        description: 'How long to record for each swing',
        values: [5, 8, 10],
        labels: ['5s', '8s', '10s'],
    },
    {
        name: 'camera_delay',
        label: 'Recording Delay',
        description: 'How long to wait between pressing record and the start of the recording',
        values: [0, 5, 10],
        labels: ['Off', '5s', '10s'],
    },
    {
        name: 'camera_overlay',
        label: 'Stance Overlay',
        description:
            'The Stance Overlay shows a semi-transparent image of how you should stand while recording your swing',
        values: [1, 0],
        labels: ['On', 'Off'],
    },
    {
        name: 'notify_new_lesson',
        label: 'Lesson Emails',
        description: 'Receive emails whenever your swing analysis has been posted or updated.',
        values: [1, 0],
        labels: ['On', 'Off'],
    },
    {
        name: 'notify_marketing',
        label: 'Marketing Emails',
        description: 'Receive emails about upcoming sales, events, etc.',
        values: [1, 0],
        labels: ['On', 'Off'],
    },
    {
        name: 'notify_newsletter',
        label: 'Newsletter Emails',
        description: 'Receive emails about news, tips, or other goings on.',
        values: [1, 0],
        labels: ['On', 'Off'],
    },
    {
        name: 'notify_reminders',
        label: 'Reminder Emails',
        description: 'Receive emails about things you might have missed.',
        values: [1, 0],
        labels: ['On', 'Off'],
    },
];
