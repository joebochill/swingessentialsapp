import { useSelector } from 'react-redux';
import { useGetLessonByIdQuery } from '../../redux/apiServices/lessonsService';
import { YoutubeCard } from './YoutubeCard';
import { RootState } from '../../redux/store';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/MainNavigation';
import { ROUTES } from '../../navigation/routeConfig';
import { format } from 'date-fns';

export const LessonCard: React.FC<{ lessonURL: string }> = ({ lessonURL }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const role = useSelector((state: RootState) => state.auth.role);

    const { data: { details: lessonDetails } = {} } = useGetLessonByIdQuery(
        { id: lessonURL, users: '' },
        {
            skip: !lessonURL,
        }
    );
    return lessonDetails ? (
        <YoutubeCard
            headerTitle={format(new Date(lessonDetails?.request_date || Date.now()), 'yyyy-MM-dd')}
            headerSubtitle={role === 'administrator' ? lessonDetails?.username : undefined}
            video={lessonDetails?.response_video}
            onExpand={(): void => navigation.push(ROUTES.LESSON, { lesson: lessonDetails.request_url })}
        />
    ) : null;
};
