import { RecordedVideoProvider } from '@/components/videos/RecordedVideoProvider';
import { Stack } from 'expo-router';

export default function SubmitLayout() {
    return (
        <RecordedVideoProvider>
            <Stack screenOptions={{ headerShown: false }}></Stack>
        </RecordedVideoProvider>
    );
}
