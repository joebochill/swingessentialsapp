import { YoutubeCard } from '@/components/videos/YoutubeCard';
import { useGetLessonByIdQuery } from '@/redux/apiServices/lessonsService';
import { RootState } from '@/redux/store';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';

export const LessonCard: React.FC<{ lessonURL: string }> = ({ lessonURL }) => {
    const router = useRouter();
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
            onExpand={(): void => {
                router.push({
                    pathname: '/(drawer)/(screens)/lessons/[id]',
                    params: { id: lessonDetails.request_url },
                });
            }}
        />
    ) : null;
};
