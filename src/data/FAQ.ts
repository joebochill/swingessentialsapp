type FAQ = {
    id: number;
    question: string;
    platform_specific: boolean;
    answer: string;
    answer_android: string;
    answer_ios: string;
    video: string;
}
export const FAQData: Array<FAQ> = [
    {
        id: 1,
        question: 'How does it work?',
        platform_specific: false,
        answer: `Once you have downloaded the app, head over to the Redeem page from the menu. There you will be able to use your device's camera to record two videos of your swing (one face-on view and one down-the-line view). Once you are satisfied with the recording, you can submit your videos for expert analysis. Our PGA professional will build a custom swing analysis video for you comparing your swing side by side with a professional golfer. This analysis will highlight some of the things you are doing well and give you some things to work on in your next session to help you continue to improve your game.`,
        answer_android: '',
        answer_ios: '',
        video: 'e8QozoBJfF8'
    },
    {
        id: 2,
        question: 'How fast will I receive my swing analysis?',
        platform_specific: false,
        answer: `We guarantee a 48-hour turnaround time on all swing analyses. However, most lessons are completed within 24 hours.`,
        answer_android: '',
        answer_ios: '',
        video: '',
    },
    {
        id: 3,
        question: 'How much does it cost?',
        platform_specific: false,
        answer: `We offer multiple different lesson packages at different price points. Generally, you'll save more by purchasing a larger package, but we also offer single lesson packages if you don't want to commit. We also offer an unlimited package which will let you submit as many lessons as you like for 30 days.`,
        answer_android: '',
        answer_ios: '',
        video: '',
    },
    {
        id: 4,
        question: 'Who does the swing analysis?',
        platform_specific: false,
        answer: `Our swing analyses are conducted by AJ Nelson, a Class A Member of the PGA. He has worked in the golf industry for seventeen years and has given thousands of lessons (online and in person). AJ has a Masters Degree from the University of Maryland, College Park and graduated from the PGA-sponsored Professional Golf Management Program.`,
        answer_android: '',
        answer_ios: '',
        video: '',
    },
    {
        id: 5,
        question: 'How do I pay?',
        platform_specific: true,
        answer: '',
        answer_ios: `Payments through the app are handled by Apple's In-App Purchase mechanism. You'll need to have a valid Apple ID with a connected payment method. If you need to add a payment method, visit your Apple ID settings.`,
        answer_android: `Payments through the app are handled by Google's In-App Payments mechanism. You'll need to have a valid Google account with a connected payment method. If you need to add a payment method, check your device settings.`,
        video: '',
    },
    {
        id: 6,
        question: 'What do I need in order to use Swing Essentials™?',
        platform_specific: false,
        answer: `All you need to get started with Swing Essentials™ is an iPhone or Android smartphone with a camera capable of recording video. If you don't have a smartphone, you can also upload your swing videos on our website.`,
        answer_android: '',
        answer_ios: '',
        video: '',
    },
    {
        id: 7,
        question: 'Why go I get an error when trying to submit my videos?',
        platform_specific: false,
        answer: `The most common cause for errors during video submission is oversized videos (our maximum supported file size is 9MB). Make sure your swing video includes only your swing - use the video trimming capabilities of your device to crop extra footage at the beginning or end.|:::|Slow-motion videos are not recommended as they take up significantly more space than regular video. If you continue to have problems after these adjustments, please contact us.`,
        answer_android: '',
        answer_ios: '',
        video: '',
    },
    {
        id: 8,
        question: 'What if I have technical problems?',
        platform_specific: false,
        answer: `If you experience any problems while using the Swing Essentials™ app, please reach out to us and let us know. We strive to provide you with the best experience possible and we welcome all of your feedback. We can be reached for questions and comments at info@swingessentials.com.`,
        answer_android: '',
        answer_ios: '',
        video: '',
    },
];








