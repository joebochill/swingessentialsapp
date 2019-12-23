import { getDate } from '../utilities';
import { Lesson } from '../__types__';

export const PlaceholderLesson: Lesson = {
    request_id: -1,
    request_url: '',
    request_date: getDate(Date.now()),
    response_video: 'l3Y3iJa6DvE',
    response_notes:
        "Welcome to the Swing Essentials family! We're super excited to have you aboard.|:::|Upload a video of your golf swing and we'll have a PGA-certified professional analyze your swing and provide a custom-tailored breakdown video highlighting what you're doing well, as well as areas you can work on to improve your game.",
    request_notes: '',
    fo_swing: '',
    dtl_swing: '',
    response_status: 'good',
    type: 'single',
    viewed: 0,
};
